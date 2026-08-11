/**
 * Sistema de geração do Termo de Compromisso e Plano de Atividades
 * Licenciatura em Pedagogia - IFSP Campus São Roque
 *
 * Arquivo de dados: contém todos os dados fixos do sistema.
 * Para atualizar: editar diretamente os arrays/objetos abaixo.
 */

// =========================================================================
// Dados da Instituição de Ensino (IFSP - fixos)
// =========================================================================
const INSTITUICAO = {
  nome: "Instituto Federal de Educação, Ciência e Tecnologia de São Paulo, campus São Roque",
  endereco: "Rodovia Prefeito Quintino de Lima, n° 2100, Paisagem Colonial, São Roque - SP. CEP 18145-090",
  telefone: "(11) 4719-9500",
  cnpj: "10.882.594/0006-70",
  diretorGeral: "Frank Viana Carvalho",
  portariaDiretor: "Portaria nº 1477/IFSP, publicada no Diário Oficial da União de 09 de abril de 2025",
  coordenadora: "Mary Grace Pereira Andrioli"
};

// =========================================================================
// Dados da Apólice de Seguro (fixos por vigência)
// =========================================================================
const SEGURO = {
  numero: "82205770",
  seguradora: "Mongeral Aegon Seguros e Previdência S.A",
  cnpjSeguradora: "33.608.308/0001-73",
  vigenciaInicio: "22/06/2026",
  vigenciaFim: "21/06/2027",
  valorCobertura: "R$ 11.500,00"
};

// =========================================================================
// Lista de Orientadores (IFSP)
// =========================================================================
const ORIENTADORES = [
  { nome: "Duzolina Alfredo Felipe de Oliveira", email: "duzolina@ifsp.edu.br" },
  { nome: "Mary Grace Pereira Andrioli",         email: "maryg@ifsp.edu.br" },
  { nome: "Moacir Silva de Castro",              email: "moacir.castro@ifsp.edu.br" },
  { nome: "Rodolfo Liporoni Dias",               email: "rodolfo.liporoni@ifsp.edu.br" },
  { nome: "Rosa Amélia Barbosa",                 email: "rosa.barbosa@ifsp.edu.br" },
  { nome: "Tatiane Monteiro da Cruz",            email: "tatiane.monteiro@ifsp.edu.br" }
];

// =========================================================================
// Lista de Estudantes
//
// Por questões de privacidade e conformidade com a LGPD (Lei nº 13.709/2018),
// os dados pessoais dos estudantes (RG, CPF, data de nascimento, endereço,
// e-mail acadêmico, condição de deficiência, etc.) NÃO ficam armazenados
// neste arquivo. No sistema atual, todos esses dados são preenchidos pelo
// próprio estudante no momento da geração do termo e descartados ao fechar
// a página (não persistem entre sessões).
//
// A lista abaixo é mantida vazia apenas para preservar a estrutura do código.
// Em futuras versões locais (uso interno na instituição), poderá ser
// populada novamente com os dados dos estudantes matriculados.
// =========================================================================
const ESTUDANTES = [];

// =========================================================================
// Lista de Escolas Parceiras
// =========================================================================
const ESCOLAS = [
  {
    nome: "EMEF Tetsu Chinone",
    cnpj: "54.334.750/0001-29",
    endereco: "Rua Paolo Sabatine, nº 475",
    cep: "18136-600",
    bairro: "Paisagem Colonial",
    cidade: "São Roque",
    estado: "SP",
    telefone: "(11) 4712-4526",
    representanteLegal: "Simone dos Santos Teodoro",
    cargoRepresentante: "Diretora",
    emailEscola: "emeftetsuchinone@saoroque.sp.gov.br",
    periodoEstagio: "Matutino, das 7h30 às 11h50",
    supervisores: [
      { nome: "Josilene Grinholli", funcao: "Professora", telefone: "", email: "" },
      { nome: "Raquel dos Santos Justo", funcao: "Professora", telefone: "", email: "raqueljusto@prof.educacao.sp.gov.br" }
    ]
  },
  {
    nome: "Escola Municipal Antonio Coelho Ramalho",
    cnpj: "01.268.966/0001-77",
    endereco: "Rua Antonio Coelho Ramalho, s/n°",
    cep: "",
    bairro: "Bairro da Figueira",
    cidade: "Ibiúna",
    estado: "SP",
    telefone: "(15) 3248-0585",
    representanteLegal: "Simone Sakoda Godinho",
    cargoRepresentante: "Diretora",
    emailEscola: "emantoniocoelho@educacao.ibuna.sp.gov.br",
    periodoEstagio: "Matutino ou Vespertino, a combinar",
    supervisores: [
      { nome: "Mila Zeiger Pedroso", funcao: "Professora", telefone: "(15) 99736-8759", email: "milazeiger@usp.br" }
    ]
  },
  {
    nome: "Escola Municipal João Evangelista de Oliveira",
    cnpj: "10.941.399/0001-69",
    endereco: "Rua Mario Scarvance, nº 324",
    cep: "",
    bairro: "Jardim Bethania",
    cidade: "Vargem Grande Paulista",
    estado: "SP",
    telefone: "(11) 4159-3235",
    representanteLegal: "Tania Calsavara da Silva",
    cargoRepresentante: "Diretora",
    emailEscola: "escolajoaoevangelistadeoliveira@gmail.com",
    periodoEstagio: "Matutino ou Vespertino, a combinar",
    supervisores: [
      { nome: "Marisol Rodrigues dos Santos", funcao: "Coordenadora Pedagógica", telefone: "", email: "" }
    ]
  },
  {
    nome: "EMEI Iolanda Lima de Oliveira",
    cnpj: "11.270.043/0001-03",
    endereco: "Rua Paolo Sabatini, nº 200",
    cep: "18136-650",
    bairro: "Goiana",
    cidade: "São Roque",
    estado: "SP",
    telefone: "(11) 4784-5601",
    representanteLegal: "Bianca Liamas Foltran",
    cargoRepresentante: "Diretora",
    emailEscola: "cmeiiolanda@saoroque.sp.gov.br",
    periodoEstagio: "Matutino, a combinar",
    supervisores: [
      { nome: "Maria de Lourdes", funcao: "Professora", telefone: "(11) 99680-4900", email: "mariavieira_20@hotmail.com" }
    ]
  },
  {
    nome: "Escola Educare",
    cnpj: "24.958.570/0002-38",
    endereco: "Rua Honório Mendes de Moraes, nº 333",
    cep: "18130-760",
    bairro: "Esplanada Mendes",
    cidade: "São Roque",
    estado: "SP",
    telefone: "(11) 4784-4500",
    representanteLegal: "Adenor Antônio de Lima",
    cargoRepresentante: "Diretor",
    emailEscola: "educaresr@gmail.com",
    periodoEstagio: "Matutino ou Vespertino, a combinar",
    supervisores: [
      { nome: "Fabiele Aparecida Trujillo da Silva", funcao: "Coordenadora", telefone: "", email: "coordfundamental.educare@gmail.com" },
      { nome: "Lígia Idalina Aparecida dos Santos Tanze", funcao: "Coordenadora", telefone: "", email: "li.idalina@hotmail.com" }
    ]
  },
  {
    nome: "Colégio Sidarta",
    cnpj: "02.111.345/0001-48",
    endereco: "Estrada Fernando Nobre, nº 1332",
    cep: "06705-490",
    bairro: "Granja Viana",
    cidade: "Cotia",
    estado: "SP",
    telefone: "(11) 4612-2321",
    representanteLegal: "Maria Aparecida Schleier",
    cargoRepresentante: "Diretora",
    emailEscola: "colegiosidarta@sidarta.org.br",
    periodoEstagio: "A combinar",
    supervisores: [
      { nome: "Adriana Cristiana dos Santos", funcao: "Coordenadora", telefone: "", email: "acsantos@sidarta.org.br" }
    ]
  },
  {
    nome: "EMEI Silvia Pinheiro Modesto",
    cnpj: "11.738.466/0001-05",
    endereco: "Rua São João, nº 127",
    cep: "18147-025",
    bairro: "Centro",
    cidade: "Araçariguama",
    estado: "SP",
    telefone: "(11) 5332-2179",
    representanteLegal: "Luciane Aparecida de Andrade",
    cargoRepresentante: "Diretora",
    emailEscola: "andrade.luciane@gmail.com",
    periodoEstagio: "A combinar",
    supervisores: [
      { nome: "Katia Pereira Martins da Silva", funcao: "Coordenadora Pedagógica", telefone: "(11) 96377-1435", email: "kpmds@uol.com.br" }
    ]
  },
  {
    nome: "SESI - Serviço Social da Indústria",
    cnpj: "03.779.133/0056-70",
    endereco: "Rua Nelson Vernalha, nº 200",
    cep: "18132-350",
    bairro: "Jardim Boa Vista",
    cidade: "São Roque",
    estado: "SP",
    telefone: "",
    representanteLegal: "Vilma Aparecida Martins Fabiano de Souza",
    cargoRepresentante: "Gerente Administrativa e Financeira",
    emailEscola: "",
    periodoEstagio: "A combinar",
    supervisores: [
      { nome: "Fernanda Cristiane Rodrigues Coelho", funcao: "Coordenadora Pedagógica", telefone: "", email: "" }
    ]
  },
  {
    nome: "EMEF Maria Aparecida de Oliveira Ribeiro",
    cnpj: "50.814.078/0001-18",
    endereco: "Rua Caçapava, nº 90",
    cep: "",
    bairro: "Vila Nova",
    cidade: "São Roque",
    estado: "SP",
    telefone: "(11) 4712-2599",
    representanteLegal: "Maurício Barros Rabelo da Silva",
    cargoRepresentante: "Diretor",
    emailEscola: "emef.m.aparecida.saoroque.sp.gov.br",
    periodoEstagio: "A combinar",
    supervisores: [
      { nome: "Maurício Barros Rabelo da Silva", funcao: "Diretor", telefone: "(11) 4712-2599", email: "" }
    ]
  },
  {
    nome: "CEMEB Primeiros Passos Vereador Dr. Paulo Ianaconi",
    cnpj: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "Itapevi",
    estado: "SP",
    telefone: "",
    representanteLegal: "",
    cargoRepresentante: "",
    emailEscola: "",
    periodoEstagio: "A combinar",
    supervisores: []
  },
  {
    nome: "Instituto Eurofarma",
    cnpj: "07.329.573/0004-55",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "Itapevi",
    estado: "SP",
    telefone: "",
    representanteLegal: "Adilson Spina",
    cargoRepresentante: "Representante Legal",
    emailEscola: "adilson.spina@eurofarma.com",
    periodoEstagio: "A combinar",
    supervisores: []
  }
].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

// =========================================================================
// Plano de Atividades por Semestre
// Estrutura: cada semestre traz lista de atividades com carga horária e descrição.
// Total geral por semestre conforme PPC do curso.
// =========================================================================
const ATIVIDADES_POR_SEMESTRE = {
  "1": {
    rotulo: "1º semestre",
    cargaTotal: 20,
    atividades: [
      { carga: "4h", sintese: "Diagnóstico da escola (estrutura, equipe, rotinas): conhecimento da infraestrutura escolar, organização administrativa e rotinas institucionais" },
      { carga: "4h", sintese: "Observação do ambiente escolar e sala de aula: acompanhamento das práticas pedagógicas e dinâmica escolar" },
      { carga: "4h", sintese: "Levantamento dos perfis dos estudantes e contexto socioeducacional: análise do perfil socioeconômico e educacional dos alunos" },
      { carga: "4h", sintese: "Observação das relações entre profissionais, alunos e comunidade: estudo das interações e relacionamentos no ambiente escolar" },
      { carga: "4h", sintese: "Participação em reuniões pedagógicas (quando possível): acompanhamento de reuniões e planejamentos pedagógicos" }
    ]
  },
  "2": {
    rotulo: "2º semestre",
    cargaTotal: 30,
    atividades: [
      { carga: "6h", sintese: "Observação das práticas pedagógicas de professores: acompanhamento direto das metodologias e estratégias utilizadas em sala de aula" },
      { carga: "6h", sintese: "Levantamento de estratégias de ensino utilizadas: identificação e análise das diferentes abordagens pedagógicas aplicadas" },
      { carga: "6h", sintese: "Acompanhamento de planejamento de aulas e projetos: participação no processo de elaboração e estruturação de atividades educativas" },
      { carga: "6h", sintese: "Observação de processos de gestão escolar e interação com famílias: análise das dinâmicas administrativas e relações escola-família" },
      { carga: "6h", sintese: "Análise de documentos e materiais didáticos: estudo dos recursos pedagógicos, documentos normativos e materiais de apoio ao ensino" }
    ]
  },
  "3": {
    rotulo: "3º semestre",
    cargaTotal: 50,
    atividades: [
      { carga: "13h", sintese: "Observação de práticas inclusivas (AEE, recursos, adaptação curricular): acompanhamento das estratégias de atendimento educacional especializado e das adequações curriculares realizadas em sala de aula" },
      { carga: "13h", sintese: "Observação de dinâmicas de alfabetização e letramento: análise das metodologias de alfabetização e das práticas de letramento desenvolvidas em sala de aula" },
      { carga: "12h", sintese: "Acompanhamento de aulas com múltiplas linguagens e práticas corporais: observação de atividades que integram arte, educação física e demais linguagens expressivas" },
      { carga: "12h", sintese: "Entrevista com professores sobre estratégias inclusivas e diferenciadas: diálogo com docentes acerca das práticas pedagógicas voltadas à diversidade e à diferenciação curricular" }
    ]
  },
  "4": {
    rotulo: "4º semestre",
    cargaTotal: 70,
    atividades: [
      { carga: "18h", sintese: "Participação no planejamento e execução de atividades interdisciplinares: atuação conjunta com docentes na elaboração e desenvolvimento de propostas que articulam diferentes áreas do conhecimento" },
      { carga: "18h", sintese: "Colaboração em projetos pedagógicos e eventos escolares: apoio na organização e realização de projetos institucionais e de atividades comemorativas da escola" },
      { carga: "17h", sintese: "Realização de pequenas intervenções ou oficinas sob supervisão: condução de atividades pontuais (oficinas ou microintervenções) com acompanhamento do professor regente" },
      { carga: "17h", sintese: "Registro reflexivo sobre a integração teoria-prática: elaboração de registros analíticos sobre a articulação entre os fundamentos teóricos do curso e a prática pedagógica observada" }
    ]
  },
  "5": {
    rotulo: "5º semestre",
    cargaTotal: 60,
    atividades: [
      { carga: "15h", sintese: "Colaboração em atividades com uso de tecnologia educacional: apoio no planejamento e desenvolvimento de propostas pedagógicas que integram recursos digitais ao processo de ensino e aprendizagem" },
      { carga: "15h", sintese: "Planejamento e implementação de estratégias cooperativas: elaboração e aplicação de atividades fundamentadas em aprendizagem cooperativa e trabalho colaborativo entre estudantes" },
      { carga: "15h", sintese: "Participação em reuniões de pais e da comunidade escolar: acompanhamento dos encontros entre escola, famílias e comunidade do entorno" },
      { carga: "15h", sintese: "Avaliação de estratégias para inclusão digital e aprendizagem colaborativa: análise crítica das práticas adotadas para promoção da inclusão digital e da colaboração entre os estudantes" }
    ]
  },
  "6": {
    rotulo: "6º semestre",
    cargaTotal: 60,
    atividades: [
      { carga: "15h", sintese: "Planejamento de atividades de leitura, escrita e matemática: elaboração de propostas pedagógicas voltadas ao desenvolvimento da leitura, da escrita e do raciocínio matemático" },
      { carga: "15h", sintese: "Elaboração e aplicação de sequências didáticas sob supervisão: desenvolvimento e execução de sequências didáticas com orientação do professor supervisor" },
      { carga: "15h", sintese: "Realização de registros avaliativos de aprendizagem: produção de registros sobre o progresso e as aprendizagens dos estudantes ao longo das atividades realizadas" },
      { carga: "15h", sintese: "Criação e execução de atividades integrando artes e demais áreas: planejamento e aplicação de propostas que articulam o ensino de artes às demais áreas do currículo" }
    ]
  },
  "7": {
    rotulo: "7º semestre",
    cargaTotal: 60,
    atividades: [
      { carga: "15h", sintese: "Regência compartilhada de aulas sob supervisão direta: atuação em sala de aula em parceria com o professor regente, com responsabilidade conjunta sobre o planejamento e a execução das aulas" },
      { carga: "15h", sintese: "Participação ativa em processos de gestão escolar (reuniões, projetos): envolvimento em reuniões pedagógicas, conselhos de classe e projetos institucionais" },
      { carga: "15h", sintese: "Planejamento e execução de sequências didáticas ou projetos temáticos: elaboração e desenvolvimento de sequências didáticas ou de projetos articulados ao currículo escolar" },
      { carga: "15h", sintese: "Realização de avaliações diagnósticas e formativas: aplicação e análise de instrumentos avaliativos para acompanhamento das aprendizagens dos estudantes" }
    ]
  },
  "8": {
    rotulo: "8º semestre",
    cargaTotal: 60,
    atividades: [
      { carga: "15h", sintese: "Regência de aulas (planejamento e execução autônoma): condução autônoma de aulas, com responsabilidade pelo planejamento, pela execução e pela avaliação das atividades" },
      { carga: "15h", sintese: "Implementação de estratégias de inclusão e adaptação curricular: desenvolvimento de práticas pedagógicas que contemplem a diversidade e as necessidades educacionais específicas dos estudantes" },
      { carga: "15h", sintese: "Participação na gestão de projetos pedagógicos e processos avaliativos: atuação em equipes responsáveis pelo planejamento e pela avaliação de projetos pedagógicos da escola" },
      { carga: "15h", sintese: "Elaboração do portfólio final e autoavaliação crítica da trajetória do estágio: sistematização das experiências do estágio em portfólio reflexivo, acompanhada de análise crítica da trajetória formativa" }
    ]
  }
};

// =========================================================================
// Texto das Cláusulas (fixos)
// =========================================================================
const CLAUSULAS = [
  {
    numero: "I",
    texto: "As Condições Gerais do Termo de Convênio formalizam a realização de estágios de estudantes do Curso de Licenciatura em Pedagogia do Instituto Federal de Educação, Ciência e Tecnologia de São Paulo. O Estágio Supervisionado de Ensino faz parte do Projeto Pedagógico do Curso da Instituição de Ensino qualificada e que indicará Professor(a) Orientador(a) responsável pelo acompanhamento e avaliação das atividades do(a) estagiário(a). De acordo com o artigo 1º da Lei 11.788/2008, além de integrar o itinerário formativo do(a) estudante, o estágio visa o aprendizado de competências próprias da atividade profissional, contextualização curricular e desenvolvimento para a vida cidadã e para o trabalho."
  },
  {
    numero: "II",
    texto: "Atrelado a essas condições, celebra-se um TERMO DE COMPROMISSO DE ESTÁGIO entre o estudante/estagiário, a Unidade Concedente e a Instituição de Ensino conforme artigo 3º da Lei 11.788/2008, o qual se constituirá como comprovante da inexistência de vínculo empregatício entre o estudante/estagiário e a Unidade Concedente."
  },
  {
    numero: "III",
    texto: "O presente Termo de Compromisso de Estágio visa assegurar a complementação da aprendizagem por meio de formação prática, integração social e desenvolvimento pessoal do estagiário, não caracterizando vínculo empregatício de qualquer espécie com a unidade concedente."
  },
  {
    numero: "IV",
    texto: "Consideram-se estágio curricular as atividades de Aprendizagem Profissional, Cultural e Social, proporcionadas ao(à) estudante pela participação em situações reais de trabalho dentro de sua área de habilitação, obrigando-o(a) a cumprir fielmente a programação de estágio. As atividades principais a serem desenvolvidas pelo(a) estudante/estagiário(a), compatíveis com o contexto básico da profissão a qual o curso se refere, estão definidas no Projeto Pedagógico do Curso de Licenciatura em Pedagogia e no Manual de Estágio do Curso de Licenciatura em Pedagogia."
  },
  {
    numero: "V",
    texto: "O acompanhamento do estágio será realizado pelo(a) Professor(a) Supervisor(a) que atua na Unidade Concedente de estágio, e pelo(a) Professor(a) Orientador(a) do Estágio no IFSP."
  },
  {
    numero: "VI",
    texto: "À Instituição de Ensino caberá a fixação dos locais, datas, e horário em que serão realizadas as atividades competentes da programação de estágio e que não coincidam com os programas de ensino em que o estudante/estagiário estuda."
  },
  {
    numero: "VII",
    textoPrefixo: "O estágio será desenvolvido no período de um ano a partir da data de assinatura deste Termo, entre os períodos ",
    textoNegrito: "{{PERIODO_ESTAGIO}}",
    textoSufixo: " conforme plano de atividades, podendo ser prorrogado por meio de Termo Aditivo. Ressaltam-se aqui os limites para jornada de estágio, estabelecidos no artigo 10º da Lei 11.788/2008, que não deve ultrapassar 6 (seis) horas diárias e 30 (trinta) horas semanais. A jornada de estágio na Unidade Concedente também não poderá coincidir com os horários de aulas do estudante/estagiário no curso de Licenciatura."
  },
  {
    numero: "VIII",
    textoPrefixo: "Durante a realização do estágio, o ESTAGIÁRIO estará ",
    textoNegrito: "coberto pela apólice de seguro nº {{SEGURO_NUMERO}}",
    textoSufixo: ", da Seguradora {{SEGURO_SEGURADORA}} CNPJ: {{SEGURO_CNPJ}}. Vigência da Apólice: Das 24h de {{SEGURO_INICIO}} às 24h de {{SEGURO_FIM}}. Valor de cobertura: {{SEGURO_VALOR}}."
  },
  {
    numero: "IX",
    texto: "Cabe ao estudante/estagiário cumprir a programação estabelecida, observando as normas internas da Instituição de Ensino e da Unidade Concedente, bem como elaborar relatório referente ao estágio, quando solicitado pelas partes."
  },
  {
    numero: "X",
    texto: "O estudante/estagiário ou seu responsável responderão pelas perdas e danos decorrentes da inobservância das normas internas ou das constantes neste Termo de Compromisso de Estágio."
  },
  {
    numero: "XI",
    texto: "Este Termo de Compromisso de Estágio terá vigência durante a realização do estágio no período descrito na Cláusula VII, podendo ser denunciado a qualquer tempo, unilateralmente, mediante comunicado escrito com antecedência de 5 (cinco) dias."
  },
  {
    numero: "XII",
    texto: "Constituem motivos para a interrupção automática do presente Termo:"
  },
  {
    numero: "XII-itens",
    texto: "a) a conclusão ou abandono do curso; b) a pedido da Instância Colaboradora; c) a pedido formal do estudante/estagiário; d) o não cumprimento do estabelecido neste instrumento; e) a pedido do IFSP."
  },
  {
    numero: "XIII",
    texto: "A Instituição de Ensino se compromete a assinar os relatórios e documentos comprobatórios utilizados pelo estudante/estagiário durante o estágio."
  },
  {
    numero: "XIV",
    texto: "O Instituto Federal de Educação, Ciência e Tecnologia de São Paulo poderá, alternativamente, se responsabilizar pela contratação de seguro contra acidentes pessoais, conforme previsto no Parágrafo único do Art. 9º da Lei 11.788, em nome do estudante/estagiário de Licenciatura, durante a realização do estágio obrigatório. Esse compromisso é regulado por portaria interna (Regulamento de Estágio do IFSP) vigente desde maio de 2011."
  },
  {
    numero: "XV",
    texto: "Fica eleito o Foro da Seção Judiciária de São Paulo da Justiça Federal da 3ª Região com renúncia de qualquer outro por mais privilegiado que seja, para dirimir quaisquer dúvidas que se originarem deste Termo de Compromisso de Estágio e que não possam ser solucionadas amigavelmente."
  }
];
