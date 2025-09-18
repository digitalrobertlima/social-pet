/* Social Pet PWA App JS (Modular Vanilla) */
const STORAGE_KEY = 'socialPetPwaFormV1';
const WHATSAPP_NUMBER = '31982313684'; // DDD + número sem +55

// ---- DOM ELEMENTS ----
const form = document.getElementById('preForm');
const steps = Array.from(document.querySelectorAll('.step'));
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const progressBar = document.getElementById('progressBar');
const btnAddPet = document.getElementById('btnAddPet');
const petsContainer = document.getElementById('petsContainer');
const petTemplate = document.getElementById('petTemplate');
const statusMsg = document.getElementById('statusMsg');
const resumoEl = document.getElementById('resumo');
const mensagemFinal = document.getElementById('mensagemFinal');
const btnGerar = document.getElementById('btnGerar');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const btnCopy = document.getElementById('btnCopy');
const btnTheme = document.getElementById('btnTheme');
const btnReset = document.getElementById('btnReset');
const btnExport = document.getElementById('btnExport');
const btnImport = document.getElementById('btnImport');
const importFile = document.getElementById('importFile');
const btnInstall = document.getElementById('btnInstall');

// Serviços fields
const tipoAtendimento = document.getElementById('tipoAtendimento');
const pagamento = document.getElementById('pagamento');
const frequenciaBanho = document.getElementById('frequenciaBanho');
const estadiaGroup = document.getElementById('estadiaGroup');
const avulsoGroup = document.getElementById('avulsoGroup');
const tosa = document.getElementById('tosa');
const medicacao = document.getElementById('medicacao');
const medicacaoDetalhesWrapper = document.getElementById('medicacaoDetalhesWrapper');
const medicacaoDetalhes = document.getElementById('medicacaoDetalhes');
const alimentacaoEspecial = document.getElementById('alimentacaoEspecial');
const alimentacaoDetalhesWrapper = document.getElementById('alimentacaoDetalhesWrapper');
const alimentacaoDetalhes = document.getElementById('alimentacaoDetalhes');
const cuidadosExtras = document.getElementById('cuidadosExtras');
const aceiteTermos = document.getElementById('aceiteTermos');
const dataEntrada = document.getElementById('dataEntrada');
const horaEntrada = document.getElementById('horaEntrada');
const dataSaida = document.getElementById('dataSaida');
const horaSaida = document.getElementById('horaSaida');
const dataAvulso = document.getElementById('dataAvulso');
const horaAvulso = document.getElementById('horaAvulso');
const tipoAvulso = document.getElementById('tipoAvulso');

let currentStep = 1;

// ---- STEP / WIZARD CONTROL ----
function setStep(step) {
  currentStep = step;
  steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === step));
  btnPrev.disabled = step === 1;
  btnNext.textContent = step === steps.length ? 'Validar' : 'Próximo →';
  const pct = (step / steps.length) * 100;
  progressBar.style.width = pct + '%';
  progressBar.textContent = `${step} / ${steps.length}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  saveState();
}

btnNext.addEventListener('click', () => {
  if (!validateCurrentStep()) return;
  if (currentStep < steps.length) setStep(currentStep + 1); else showStatus('Todos os dados válidos. Gere a mensagem.', true);
});
btnPrev.addEventListener('click', () => setStep(Math.max(1, currentStep - 1)));

// ---- PETS ----
function addPet(initialData = null) {
  const node = petTemplate.content.cloneNode(true);
  const card = node.querySelector('[data-pet-card]');
  const removeBtn = node.querySelector('.remove-pet');
  removeBtn.addEventListener('click', () => { if (confirm('Remover este pet?')) { card.remove(); saveState(); updateResumo(); } });
  if (initialData) {
    Object.entries(initialData).forEach(([k, v]) => {
      const el = card.querySelector(`[name="${k}"]`);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
    });
  }
  petsContainer.appendChild(node);
}
btnAddPet?.addEventListener('click', () => { addPet(); saveState(); });

function collectPets() {
  return Array.from(petsContainer.querySelectorAll('[data-pet-card]')).map(card => {
    const data = {};
    card.querySelectorAll('input,select,textarea').forEach(inp => {
      if (inp.type === 'checkbox') data[inp.name] = inp.checked; else data[inp.name] = inp.value.trim();
    });
    return data;
  });
}

// ---- VALIDATION ----
function validateCurrentStep() {
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
  }
  const customErrors = businessRules();
  if (customErrors.length) {
    showStatus(customErrors[0], false);
    return false;
  }
  showStatus('');
  return true;
}

function businessRules() {
  const errors = [];
  const tutorNome = document.getElementById('tutorNome').value.trim();
  const tutorTelefone = document.getElementById('tutorTelefone').value.replace(/\D/g, '');
  if (!tutorNome) errors.push('Informe o nome do tutor.');
  if (tutorTelefone.length < 10) errors.push('Telefone do tutor inválido.');
  if (collectPets().length === 0) errors.push('Inclua pelo menos um pet.');
  const tipo = tipoAtendimento.value;
  if (!tipo) errors.push('Selecione o tipo de atendimento.');
  const isHotel = tipo === 'hotel' || tipo === 'creche';
  const opHours = (t) => { if (!t) return false; const [h, m] = t.split(':').map(Number); return h >= 9 && (h < 20 || (h === 20 && m === 0)); };
  const weekday = (dStr) => { if (!dStr) return -1; const d = new Date(dStr + 'T12:00:00'); return d.getUTCDay(); };// 0=Dom,6=Sab
  if (isHotel) {
    if (!dataEntrada.value || !dataSaida.value) errors.push('Informe entrada e saída.');
    if (dataEntrada.value && dataSaida.value) {
      if (new Date(dataEntrada.value) > new Date(dataSaida.value)) errors.push('Entrada não pode ser após a saída.');
      if ([0,6].includes(weekday(dataEntrada.value))) errors.push('Check-in apenas dias úteis.');
      if ([0,6].includes(weekday(dataSaida.value))) errors.push('Check-out apenas dias úteis.');
    }
    const limit18 = (t)=>{ if (!t) return false; const [h]=t.split(':').map(Number); return h <= 18; };
    if (!opHours(horaEntrada.value) || !opHours(horaSaida.value)) errors.push('Horários entre 09:00 e 20:00.');
    if (!limit18(horaEntrada.value) || !limit18(horaSaida.value)) errors.push('Check-in/out somente até 18:00.');
  } else if (tipo === 'avulso') {
    if (!dataAvulso.value) errors.push('Informe a data do serviço avulso.');
    if (!horaAvulso.value) errors.push('Informe o horário do serviço avulso.');
    if (!tipoAvulso.value) errors.push('Selecione o tipo de serviço avulso.');
    if (!opHours(horaAvulso.value)) errors.push('Horário avulso deve estar entre 09:00 e 20:00.');
  }
  if (currentStep === steps.length && !aceiteTermos.checked) errors.push('Aceite os termos.');
  return errors;
}

// ---- MESSAGE BUILD ----
function buildMessage() {
  const tutorNome = document.getElementById('tutorNome').value.trim();
  const tutorTelefone = document.getElementById('tutorTelefone').value.trim();
  const tutorEmail = document.getElementById('tutorEmail').value.trim();
  const tutorObs = document.getElementById('tutorObs').value.trim();
  const tipo = tipoAtendimento.value;
  const pay = pagamento.value;
  const freqBanho = frequenciaBanho.value;
  const tosaSel = tosa.value;
  const med = medicacao.value === 'sim' ? medicacaoDetalhes.value.trim() : 'Não';
  const alim = alimentacaoEspecial.value === 'sim' ? alimentacaoDetalhes.value.trim() : 'Normal';
  const cuidados = cuidadosExtras.value.trim();
  const pets = collectPets();
  const petsTxt = pets.map((p,i)=>{
    const vacinas = ['vac_V8','vac_antirrabica','vac_gripe','vac_giardia'].filter(k=>p[k]).map(k=>({vac_V8:'V8/V10',vac_antirrabica:'Antirrábica',vac_gripe:'Gripe',vac_giardia:'Giardia'}[k])).join(', ') || '—';
    return `#${i+1} Nome: ${p.nome}\n  Porte: ${p.porte} | Raça: ${p.raca||'—'} | Idade: ${p.idade||'—'} | Peso: ${p.peso||'—'}kg | Sexo: ${p.sexo||'—'}\n  Comportamento: ${p.comportamento||'—'}\n  Vacinas: ${vacinas}\n  Restrições/Alergias: ${p.restricoes||'—'}\n  Observações: ${p.observacoes||'—'}`; }).join('\n\n');
  let servicosTxt='';
  if (tipo === 'hotel' || tipo === 'creche') {
    servicosTxt += `Tipo: ${tipo.toUpperCase()}\nEntrada: ${dataEntrada.value} ${horaEntrada.value}\nSaída: ${dataSaida.value} ${horaSaida.value}\nBanho durante estadia: ${freqBanho}\n`;
  } else {
    servicosTxt += `Serviço Avulso: ${tipoAvulso.value} em ${dataAvulso.value} às ${horaAvulso.value}\n`;
  }
  if (tosaSel !== 'nao') servicosTxt += `Tosa: ${tosaSel}\n`;
  servicosTxt += `Medicação: ${med}\nAlimentação Especial: ${alim}\n`;
  if (cuidados) servicosTxt += `Cuidados Extras: ${cuidados}\n`;
  const header = '*Pré-Atendimento Social Pet*\n--------------------------------';
  const tutorBlock = `Tutor: ${tutorNome}\nTelefone: ${tutorTelefone}\nE-mail: ${tutorEmail||'—'}${tutorObs?"\nObservações Tutor: "+tutorObs:""}`;
  const petsBlock = `Pets (Total ${pets.length}):\n${petsTxt}`;
  const servicosBlock = `Serviços Solicitados:\n${servicosTxt}`;
  const footer = 'Política cancelamento: aviso 7 dias sem cobrança (demais condições a combinar).';
  return `${header}\n${tutorBlock}\n\n${petsBlock}\n\n${servicosBlock}\nForma Pagamento Preferida: ${pay}\n\n${footer}`;
}

function generateWhatsAppLink(message) {
  return `https://wa.me/55${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---- STATE ----
function saveState() {
  const data = { form: Object.fromEntries(new FormData(form).entries()), pets: collectPets(), currentStep };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return;
    const data = JSON.parse(raw);
    if (data.form) {
      Object.entries(data.form).forEach(([k,v]) => { const el = form.querySelector(`[name="${k}"]`); if (!el) return; if (el.type === 'checkbox') el.checked = v === 'on' || v === true || v === 'true'; else el.value = v; });
    }
    if (data.pets?.length) { petsContainer.innerHTML=''; data.pets.forEach(p=>addPet(p)); }
    if (data.currentStep) setStep(data.currentStep); else setStep(1);
    updateDynamicFields();
    updateResumo();
  } catch(e){ console.warn('Falha load state', e); }
}

// ---- DYNAMIC UI ----
function updateDynamicFields() {
  const tipo = tipoAtendimento.value;
  if (tipo === 'hotel' || tipo === 'creche') {
    estadiaGroup.classList.remove('d-none');
    avulsoGroup.classList.add('d-none');
    frequenciaBanho.disabled = false; tosa.disabled = false;
  } else if (tipo === 'avulso') {
    estadiaGroup.classList.add('d-none');
    avulsoGroup.classList.remove('d-none');
    frequenciaBanho.disabled = true; frequenciaBanho.value = 'nao'; tosa.disabled = false;
  } else {
    estadiaGroup.classList.add('d-none');
    avulsoGroup.classList.add('d-none');
    frequenciaBanho.disabled = true; tosa.disabled = true;
  }
  medicacaoDetalhesWrapper.classList.toggle('d-none', medicacao.value !== 'sim');
  alimentacaoDetalhesWrapper.classList.toggle('d-none', alimentacaoEspecial.value !== 'sim');
}

function updateResumo() {
  const msg = buildMessage();
  resumoEl.innerHTML = `<pre class='p-3 bg-body-tertiary rounded border'>${msg.replace(/</g,'&lt;')}</pre>`;
}

// ---- EVENTS ----
['change','input','blur'].forEach(ev => form.addEventListener(ev, () => { saveState(); updateResumo(); }));
btnTheme.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-bs-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-bs-theme', next);
  localStorage.setItem('theme', next);
});
btnReset.addEventListener('click', () => { if(!confirm('Limpar todos os dados?')) return; localStorage.removeItem(STORAGE_KEY); form.reset(); petsContainer.innerHTML=''; addPet(); setStep(1); updateDynamicFields(); updateResumo(); showStatus('Limpo'); });
btnExport.addEventListener('click', () => { const blob = new Blob([localStorage.getItem(STORAGE_KEY)||'{}'], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='socialpet-export.json'; a.click(); URL.revokeObjectURL(a.href);} );
btnImport.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', e => { const f=e.target.files?.[0]; if(!f) return; const reader = new FileReader(); reader.onload=()=>{ try{ localStorage.setItem(STORAGE_KEY, reader.result); loadState(); showStatus('Importado', true);}catch{ showStatus('Falha importação', false);} }; reader.readAsText(f); });

tipoAtendimento.addEventListener('change', () => { updateDynamicFields(); updateResumo(); });
medicacao.addEventListener('change', updateDynamicFields);
alimentacaoEspecial.addEventListener('change', updateDynamicFields);

btnGerar.addEventListener('click', () => {
  const errs = businessRules();
  if (errs.length) { showStatus(errs[0], false); return; }
  const msg = buildMessage();
  mensagemFinal.value = msg; btnCopy.disabled = false; btnWhatsApp.classList.remove('disabled'); btnWhatsApp.href = generateWhatsAppLink(msg); showStatus('Mensagem gerada', true); setStep(4); updateResumo();
});

btnCopy.addEventListener('click', async () => { try{ await navigator.clipboard.writeText(mensagemFinal.value); showStatus('Copiado'); } catch{ showStatus('Falha ao copiar', false);} });

function showStatus(msg, ok=true){ statusMsg.textContent = msg; statusMsg.className = 'align-self-center small ' + (ok? 'text-success':'text-danger'); }

window.addEventListener('beforeunload', saveState);

// ---- INSTALL PROMPT (PWA) ----
let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; btnInstall.classList.remove('d-none'); });
btnInstall.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice; if (choice.outcome === 'accepted') { showStatus('Instalação iniciada', true); } deferredPrompt = null; btnInstall.classList.add('d-none'); });

// ---- SW REGISTER ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW fail', err)); });
}

// ---- INIT ----
(function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const savedTheme = localStorage.getItem('theme'); if (savedTheme) document.documentElement.setAttribute('data-bs-theme', savedTheme);
  if (!petsContainer.children.length) addPet();
  loadState();
  updateResumo();
})();
