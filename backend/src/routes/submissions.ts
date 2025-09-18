import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';

const petSchema = z.object({
  nome: z.string().min(1),
  porte: z.string().min(1),
  raca: z.string().optional().default(''),
  idade: z.string().optional().default(''),
  peso: z.string().optional().default(''),
  sexo: z.string().optional().default(''),
  comportamento: z.string().optional().default(''),
  restricoes: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),
  vac_V8: z.boolean().optional(),
  vac_antirrabica: z.boolean().optional(),
  vac_gripe: z.boolean().optional(),
  vac_giardia: z.boolean().optional()
});

const submissionSchema = z.object({
  tutorNome: z.string().min(1),
  tutorTelefone: z.string().min(8),
  tutorEmail: z.string().email().optional().or(z.literal('')),
  tutorObs: z.string().optional().default(''),
  tipoAtendimento: z.enum(['hotel','creche','avulso']),
  pagamento: z.enum(['PIX','Cartão','Dinheiro']),
  frequenciaBanho: z.string().optional(),
  tosa: z.string().optional(),
  medicacao: z.string().optional(),
  medicacaoDetalhes: z.string().optional(),
  alimentacaoEspecial: z.string().optional(),
  alimentacaoDetalhes: z.string().optional(),
  cuidadosExtras: z.string().optional(),
  aceiteTermos: z.union([z.string(), z.boolean()]),
  pets: z.array(petSchema),
  // datas flexíveis (validação adicional futuramente)
  dataEntrada: z.string().optional(),
  horaEntrada: z.string().optional(),
  dataSaida: z.string().optional(),
  horaSaida: z.string().optional(),
  dataAvulso: z.string().optional(),
  horaAvulso: z.string().optional(),
  tipoAvulso: z.string().optional()
});

export async function submissionRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.post('/submissions', async (request, reply) => {
    const parse = submissionSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Validation failed', issues: parse.error.issues });
    }

    // Placeholder: persistência futura (DB). Aqui apenas ecoa + id fake.
    const now = new Date().toISOString();
    const id = Math.random().toString(36).slice(2, 10);

    return { id, receivedAt: now, data: parse.data };
  });
}
