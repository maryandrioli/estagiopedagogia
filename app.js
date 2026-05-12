/**
 * Sistema de Geração do Termo de Compromisso de Estágio
 * Lógica principal: vincula formulário, dados e pré-visualização,
 * além de gerar o arquivo .docx para download.
 */

// =========================================================================
// Estado da aplicação
// =========================================================================
const estado = {
  escola: null,               // escola selecionada
  supervisor: null,           // supervisor selecionado dentro da escola
  orientador: null,           // orientador IFSP
  semestres: [],              // semestres selecionados ['1', '2', ...]
  camposLivres: {             // todos os campos do aluno (preenchidos manualmente)
    nomeAluno: "",
    rg: "",
    cpf: "",
    prontuario: "",
    dataNasc: "",
    pcd: "Não",
    enderecoAluno: "",
    cepAluno: "",
    bairroAluno: "",
    cidadeAluno: "",
    estadoAluno: "SP",
    telefoneAluno: "",
    celularAluno: "",
    emailPessoal: "",
    periodoCurso: "Noturno",
    cargaDiaria: "",
    estagioInicio: "",
    estagioFim: "",
    periodoEstagio: ""
  },
  camposEscolaLivres: {        // se selecionar "Outra escola"
    nome: "",
    cnpj: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "",
    estado: "SP",
    telefone: "",
    representanteLegal: "",
    cargoRepresentante: "",
    emailEscola: "",
    periodoEstagio: "",
    supervisorNome: "",
    supervisorFuncao: "",
    supervisorTelefone: "",
    supervisorEmail: ""
  },
  camposOrientadorLivres: {    // se selecionar "Digitar manualmente"
    nome: "",
    email: ""
  },
  camposSupervisorLivres: {    // se selecionar "Digitar manualmente" na escola
    nome: "",
    email: ""
  },
  dataAssinatura: {            // data do termo
    dia: new Date().getDate().toString().padStart(2, "0"),
    mes: meses(new Date().getMonth()),
    ano: new Date().getFullYear().toString()
  }
};

function meses(idx) {
  return [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ][idx];
}

/**
 * Aplica máscara XX/XX/XXXX ao valor digitado em um campo de data.
 * - Remove caracteres não-numéricos
 * - Limita a 8 dígitos
 * - Insere barras nas posições corretas
 */
function aplicarMascaraData(valor) {
  const digitos = (valor || "").replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return digitos.slice(0, 2) + "/" + digitos.slice(2);
  return digitos.slice(0, 2) + "/" + digitos.slice(2, 4) + "/" + digitos.slice(4);
}

/**
 * Formata um objeto Date em string DD/MM/AAAA.
 */
function formatarData(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const aaaa = d.getFullYear();
  return `${dd}/${mm}/${aaaa}`;
}

/**
 * Aplica máscara 000.000.000-00 ao CPF.
 * Aceita até 11 dígitos; caracteres não numéricos são removidos.
 */
function formatarCPF(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.slice(0, 3) + "." + d.slice(3);
  if (d.length <= 9) return d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6);
  return d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6, 9) + "-" + d.slice(9);
}

/** Retorna true se o CPF estiver no formato 000.000.000-00 (11 dígitos). */
function cpfValido(valor) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor || "");
}

/**
 * Aplica máscara 00000-000 ao CEP.
 */
function formatarCEP(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + "-" + d.slice(5);
}

/** Retorna true se o CEP estiver no formato 00000-000. */
function cepValido(valor) {
  return /^\d{5}-\d{3}$/.test(valor || "");
}

/**
 * Aplica máscara de telefone fixo (00) 0000-0000 OU celular (00) 00000-0000.
 * Detecta automaticamente pelo tamanho.
 */
function formatarFoneFixo(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
}

function formatarCelular(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  if (d.length <= 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}

/** True se o telefone tiver o formato (00) 0000-0000. */
function telefoneValido(valor) {
  return /^\(\d{2}\) \d{4}-\d{4}$/.test(valor || "");
}

/** True se o celular tiver o formato (00) 00000-0000. */
function celularValido(valor) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(valor || "");
}

/** Validação básica de e-mail: usuário@dominio.tld */
function emailValido(valor) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test((valor || "").trim());
}

/**
 * Validação para data de nascimento: formato completo + não pode ser futura
 * + idade plausível (entre 14 e 100 anos).
 */
function dataNascimentoValida(valor) {
  if (!valor || valor.length !== 10) return false;
  const d = parseData(valor);
  if (!d) return false;
  const hoje = new Date();
  if (d > hoje) return false;
  const idade = hoje.getFullYear() - d.getFullYear();
  return idade >= 14 && idade <= 100;
}

/**
 * Converte para maiúsculas preservando o cursor.
 * Aplicada em campos de nome, endereço, bairro, cidade, etc.
 */
function paraMaiusculas(valor) {
  return (valor || "").toUpperCase();
}

/**
 * Formata um número de prontuário no padrão IFSP: duas letras maiúsculas
 * seguidas de até 7 dígitos. Caracteres inválidos são descartados.
 * Exemplo: "rq3051595" → "RQ3051595"
 */
function formatarProntuario(valor) {
  if (!valor) return "";
  const chars = [];
  for (let i = 0; i < valor.length; i++) {
    const c = valor[i];
    if (chars.length < 2) {
      if (/[a-zA-Z]/.test(c)) chars.push(c.toUpperCase());
    } else {
      if (/\d/.test(c)) chars.push(c);
    }
    if (chars.length >= 9) break;
  }
  return chars.join("");
}

/**
 * Limita a carga horária diária a no máximo 6 horas inteiras.
 * Retorna valor sanitizado (string).
 */
function limitarCargaDiaria(valor) {
  const apenasNum = (valor || "").replace(/\D/g, "").slice(0, 1);
  if (apenasNum === "") return "";
  const n = parseInt(apenasNum, 10);
  if (n > 6) return "6";
  if (n < 1) return "";
  return String(n);
}

/**
 * Converte string no formato DD/MM/AAAA em objeto Date.
 * Retorna null se incompleto ou inválido.
 */
function parseData(str) {
  if (!str || str.length < 10) return null;
  const [d, m, a] = str.split("/").map(s => parseInt(s, 10));
  if (!d || !m || !a) return null;
  const dt = new Date(a, m - 1, d);
  if (dt.getDate() !== d || dt.getMonth() !== m - 1 || dt.getFullYear() !== a) return null;
  return dt;
}

/**
 * Valida as datas de início e fim do estágio.
 * Regras: ano não pode ser anterior ao ano atual; fim deve ser posterior ao início.
 * Exibe mensagem no aviso e marca o campo problemático em vermelho.
 */
function validarDatasEstagio() {
  const camp = estado.camposLivres;
  const aviso = document.getElementById("aviso-data-estagio");
  const inpIni = document.getElementById("inp-estagioInicio");
  const inpFim = document.getElementById("inp-estagioFim");
  if (!aviso || !inpIni || !inpFim) return true;

  const anoAtual = new Date().getFullYear();
  inpIni.style.borderColor = "";
  inpFim.style.borderColor = "";
  aviso.style.display = "none";
  aviso.textContent = "";

  const dIni = parseData(camp.estagioInicio);
  const dFim = parseData(camp.estagioFim);

  if (camp.estagioInicio && camp.estagioInicio.length === 10 && !dIni) {
    aviso.textContent = "Data de início inválida. Use o formato DD/MM/AAAA.";
    aviso.style.display = "block";
    inpIni.style.borderColor = "#c33";
    return false;
  }
  if (camp.estagioFim && camp.estagioFim.length === 10 && !dFim) {
    aviso.textContent = "Data de término inválida. Use o formato DD/MM/AAAA.";
    aviso.style.display = "block";
    inpFim.style.borderColor = "#c33";
    return false;
  }
  if (dIni && dIni.getFullYear() < anoAtual) {
    aviso.textContent = "O ano da data de início não pode ser anterior a " + anoAtual + ".";
    aviso.style.display = "block";
    inpIni.style.borderColor = "#c33";
    camp.estagioInicio = "";
    inpIni.value = "";
    return false;
  }
  if (dFim && dFim.getFullYear() < anoAtual) {
    aviso.textContent = "O ano da data de término não pode ser anterior a " + anoAtual + ".";
    aviso.style.display = "block";
    inpFim.style.borderColor = "#c33";
    camp.estagioFim = "";
    inpFim.value = "";
    return false;
  }
  if (dIni && dFim && dFim <= dIni) {
    aviso.textContent = "A data de término deve ser posterior à data de início.";
    aviso.style.display = "block";
    inpFim.style.borderColor = "#c33";
    return false;
  }
  return true;
}

/**
 * Quando o aluno cursa Pedagogia no período Noturno, desabilita a opção
 * "Noturno" para a realização do estágio (não pode coincidir com aulas).
 */
function atualizarBloqueioNoturno() {
  const periodoCurso = estado.camposLivres.periodoCurso || "Noturno";
  const optNoturno = document.getElementById("opt-noturno");
  const radioNoturno = document.querySelector('input[name="periodoEstagio"][value="Noturno"]');
  const aviso = document.getElementById("aviso-noturno");
  if (!optNoturno || !radioNoturno) return;
  if (periodoCurso === "Noturno") {
    radioNoturno.disabled = true;
    radioNoturno.checked = false;
    optNoturno.classList.add("desabilitado");
    if (aviso) aviso.style.display = "block";
    if (estado.camposLivres.periodoEstagio === "Noturno") {
      estado.camposLivres.periodoEstagio = "";
      atualizarPreview();
    }
  } else {
    radioNoturno.disabled = false;
    optNoturno.classList.remove("desabilitado");
    if (aviso) aviso.style.display = "none";
  }
}

// =========================================================================
// Inicialização
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  popularEscolas();
  popularOrientadores();
  popularSemestres();
  popularData();
  popularDatasEstagio();
  configurarListeners();
  atualizarPreview();
});

/**
 * Pré-preenche as datas do estágio: início = hoje, fim = hoje + 2 anos.
 * O aluno pode alterar manualmente depois.
 */
function popularDatasEstagio() {
  const hoje = new Date();
  const daquiDoisAnos = new Date(hoje.getFullYear() + 2, hoje.getMonth(), hoje.getDate());
  const inicioStr = formatarData(hoje);
  const fimStr = formatarData(daquiDoisAnos);
  estado.camposLivres.estagioInicio = inicioStr;
  estado.camposLivres.estagioFim = fimStr;
  const inpIni = document.getElementById("inp-estagioInicio");
  const inpFim = document.getElementById("inp-estagioFim");
  if (inpIni) inpIni.value = inicioStr;
  if (inpFim) inpFim.value = fimStr;
}

function popularEscolas() {
  const sel = document.getElementById("sel-escola");
  sel.innerHTML = '<option value="">— selecione a escola —</option>';
  ESCOLAS.forEach((e, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = e.nome;
    sel.appendChild(opt);
  });
  const optOutra = document.createElement("option");
  optOutra.value = "outra";
  optOutra.textContent = "— Outra escola (preencher manualmente) —";
  sel.appendChild(optOutra);
}

function popularOrientadores() {
  const sel = document.getElementById("sel-orientador");
  sel.innerHTML = '<option value="">— selecione o(a) orientador(a) —</option>';
  ORIENTADORES.forEach((o, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = o.nome;
    sel.appendChild(opt);
  });
  const optManual = document.createElement("option");
  optManual.value = "manual";
  optManual.textContent = "— Digitar manualmente —";
  sel.appendChild(optManual);
}

function popularSemestres() {
  const cont = document.getElementById("semestres-container");
  cont.innerHTML = "";
  ["1","2","3","4","5","6","7","8"].forEach(s => {
    const label = document.createElement("label");
    label.className = "semestre-check";
    label.innerHTML = `<input type="checkbox" value="${s}"> ${s}º semestre`;
    cont.appendChild(label);
  });
}

function popularData() {
  document.getElementById("data-dia").value = estado.dataAssinatura.dia;
  document.getElementById("data-mes").value = estado.dataAssinatura.mes;
  document.getElementById("data-ano").value = estado.dataAssinatura.ano;
}

// =========================================================================
// Listeners
// =========================================================================
function configurarListeners() {
  document.getElementById("sel-escola").addEventListener("change", (ev) => {
    const v = ev.target.value;
    if (v === "outra") {
      estado.escola = "outra";
      document.getElementById("bloco-escola-livre").style.display = "block";
    } else if (v === "") {
      estado.escola = null;
      document.getElementById("bloco-escola-livre").style.display = "none";
    } else {
      estado.escola = ESCOLAS[parseInt(v)];
      document.getElementById("bloco-escola-livre").style.display = "none";
    }
    estado.supervisor = null;
    atualizarSupervisores();
    atualizarPreview();
  });

  document.getElementById("sel-supervisor").addEventListener("change", (ev) => {
    const v = ev.target.value;
    const bloco = document.getElementById("bloco-supervisor-livre");
    if (v === "manual") {
      estado.supervisor = "manual";
      if (bloco) bloco.style.display = "block";
    } else if (v === "" || !estado.escola || estado.escola === "outra") {
      estado.supervisor = v === "" ? null : estado.supervisor;
      if (bloco) bloco.style.display = "none";
    } else {
      estado.supervisor = estado.escola.supervisores[parseInt(v)];
      if (bloco) bloco.style.display = "none";
    }
    atualizarPreview();
  });

  // Campos livres do supervisor manual
  ["nome","email"].forEach(c => {
    const el = document.getElementById("inp-sup-" + c);
    if (el) {
      el.addEventListener("input", (ev) => {
        if (c === "nome") ev.target.value = paraMaiusculas(ev.target.value);
        estado.camposSupervisorLivres[c] = ev.target.value;
        atualizarPreview();
      });
    }
  });

  document.getElementById("sel-orientador").addEventListener("change", (ev) => {
    const v = ev.target.value;
    const bloco = document.getElementById("bloco-orientador-livre");
    if (v === "manual") {
      estado.orientador = "manual";
      bloco.style.display = "block";
    } else if (v === "") {
      estado.orientador = null;
      bloco.style.display = "none";
    } else {
      estado.orientador = ORIENTADORES[parseInt(v)];
      bloco.style.display = "none";
    }
    atualizarPreview();
  });

  // Campos livres do orientador manual
  ["nome","email"].forEach(c => {
    const el = document.getElementById("inp-orient-" + c);
    if (el) {
      el.addEventListener("input", (ev) => {
        if (c === "nome") ev.target.value = paraMaiusculas(ev.target.value);
        estado.camposOrientadorLivres[c] = ev.target.value;
        atualizarPreview();
      });
    }
  });

  document.getElementById("semestres-container").addEventListener("change", () => {
    const checks = document.querySelectorAll("#semestres-container input:checked");
    estado.semestres = Array.from(checks).map(c => c.value).sort();
    document.querySelectorAll("#semestres-container label").forEach(label => {
      const input = label.querySelector("input");
      label.classList.toggle("selected", input.checked);
    });
    atualizarPreview();
  });

  // Campos livres do estudante
  ["nomeAluno","rg","cpf","prontuario","dataNasc","pcd",
   "enderecoAluno","cepAluno","bairroAluno","cidadeAluno","estadoAluno",
   "telefoneAluno","celularAluno","emailPessoal","periodoCurso"]
   .forEach(c => {
    const el = document.getElementById("inp-" + c);
    if (el) {
      const evento = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evento, (ev) => {
        // Aplica formatação específica por campo
        if (c === "dataNasc")   ev.target.value = aplicarMascaraData(ev.target.value);
        else if (c === "prontuario") ev.target.value = formatarProntuario(ev.target.value);
        else if (c === "cpf")        ev.target.value = formatarCPF(ev.target.value);
        else if (c === "cepAluno")   ev.target.value = formatarCEP(ev.target.value);
        else if (c === "telefoneAluno") ev.target.value = formatarFoneFixo(ev.target.value);
        else if (c === "celularAluno") ev.target.value = formatarCelular(ev.target.value);
        // Padroniza em maiúsculas: nome, endereço, bairro, cidade, estado, RG
        else if (["nomeAluno","enderecoAluno","bairroAluno","cidadeAluno","estadoAluno","rg"].includes(c)) {
          ev.target.value = paraMaiusculas(ev.target.value);
        }
        estado.camposLivres[c] = ev.target.value;
        atualizarPreview();
      });
    }
  });

  // Campos de período do estágio: datas e turno
  ["estagioInicio","estagioFim"].forEach(c => {
    const el = document.getElementById("inp-" + c);
    if (!el) return;
    el.addEventListener("input", (ev) => {
      ev.target.value = aplicarMascaraData(ev.target.value);
      estado.camposLivres[c] = ev.target.value;
      validarDatasEstagio();
      atualizarPreview();
    });
    el.addEventListener("blur", (ev) => {
      validarDatasEstagio();
    });
  });

  // Radios de turno do estágio
  document.querySelectorAll('input[name="periodoEstagio"]').forEach(r => {
    r.addEventListener("change", (ev) => {
      estado.camposLivres.periodoEstagio = ev.target.value;
      atualizarPreview();
    });
  });

  // Quando o aluno muda o período do curso, ajusta a opção "Noturno" do estágio
  const selPeriodoCurso = document.getElementById("inp-periodoCurso");
  if (selPeriodoCurso) {
    selPeriodoCurso.addEventListener("change", () => atualizarBloqueioNoturno());
  }
  atualizarBloqueioNoturno();

  // Campo de carga horária diária (limite máximo: 6h)
  const elCarga = document.getElementById("inp-cargaDiaria");
  if (elCarga) {
    elCarga.addEventListener("input", (ev) => {
      ev.target.value = limitarCargaDiaria(ev.target.value);
      estado.camposLivres.cargaDiaria = ev.target.value;
      atualizarPreview();
    });
    // Garante limite ao colar valores ou usar setas do navegador
    elCarga.addEventListener("blur", (ev) => {
      ev.target.value = limitarCargaDiaria(ev.target.value);
      estado.camposLivres.cargaDiaria = ev.target.value;
      atualizarPreview();
    });
  }

  // Campos livres da escola (modo "outra")
  ["nome","cnpj","endereco","cep","bairro","cidade","estado","telefone",
   "representanteLegal","cargoRepresentante","emailEscola","periodoEstagio",
   "supervisorNome","supervisorFuncao","supervisorTelefone","supervisorEmail"]
   .forEach(c => {
    const el = document.getElementById("inp-esc-" + c);
    if (el) {
      el.addEventListener("input", (ev) => {
        // Aplica máscaras/maiúsculas conforme o campo
        if (c === "cep")        ev.target.value = formatarCEP(ev.target.value);
        else if (c === "telefone" || c === "supervisorTelefone")
                                ev.target.value = formatarFoneFixo(ev.target.value);
        else if (["nome","endereco","bairro","cidade","estado","representanteLegal",
                  "cargoRepresentante","supervisorNome","supervisorFuncao"].includes(c)) {
          ev.target.value = paraMaiusculas(ev.target.value);
        }
        estado.camposEscolaLivres[c] = ev.target.value;
        atualizarPreview();
      });
    }
  });

  // Data - dia (00-31) e ano (4 dígitos) aceitam apenas números
  ["dia","mes","ano"].forEach(c => {
    const el = document.getElementById("data-" + c);
    const evento = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evento, (ev) => {
      let v = ev.target.value;
      if (c === "dia") {
        v = v.replace(/\D/g, "").slice(0, 2);
        const n = parseInt(v, 10);
        if (!isNaN(n) && n > 31) v = "31";
        ev.target.value = v;
      } else if (c === "ano") {
        v = v.replace(/\D/g, "").slice(0, 4);
        ev.target.value = v;
      }
      estado.dataAssinatura[c] = v;
      atualizarPreview();
    });
  });

  // Botões principais
  const acaoImprimir = () => executarComValidacao(() => window.print());
  const acaoBaixar = () => executarComValidacao(baixarDoc);

  document.getElementById("btn-imprimir").addEventListener("click", acaoImprimir);
  document.getElementById("btn-doc").addEventListener("click", acaoBaixar);
  document.getElementById("btn-limpar").addEventListener("click", limparFormulario);

  // Botões rápidos (versão mobile, acima do preview)
  const btnImprimirRapido = document.getElementById("btn-imprimir-rapido");
  const btnDocRapido = document.getElementById("btn-doc-rapido");
  if (btnImprimirRapido) btnImprimirRapido.addEventListener("click", acaoImprimir);
  if (btnDocRapido) btnDocRapido.addEventListener("click", acaoBaixar);

  // Modal
  const btnFechar = document.getElementById("btn-fechar-modal");
  if (btnFechar) btnFechar.addEventListener("click", fecharModalCampos);
  const modal = document.getElementById("modal-campos");
  if (modal) modal.addEventListener("click", (ev) => {
    if (ev.target === modal) fecharModalCampos();
  });
}

function atualizarSupervisores() {
  const sel = document.getElementById("sel-supervisor");
  sel.innerHTML = '<option value="">— selecione o(a) supervisor(a) —</option>';
  if (estado.escola && estado.escola !== "outra" && estado.escola.supervisores) {
    estado.escola.supervisores.forEach((s, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = s.nome + (s.funcao ? " (" + s.funcao + ")" : "");
      sel.appendChild(opt);
    });
  }
  // Opção sempre disponível: digitar manualmente o(a) supervisor(a)
  if (estado.escola && estado.escola !== "outra") {
    const optManual = document.createElement("option");
    optManual.value = "manual";
    optManual.textContent = "— Digitar o nome do(a) supervisor(a) —";
    sel.appendChild(optManual);
  }
}

function limparFormulario() {
  if (confirm("Limpar todos os campos preenchidos?")) {
    location.reload();
  }
}

/**
 * Retorna o status de todos os campos obrigatórios.
 * Cada item: { descricao, ok, elementoId }
 *   - descricao: rótulo amigável para o aluno
 *   - ok: true se preenchido corretamente
 *   - elementoId: id do input/grupo correspondente (para destacar visualmente)
 */
function obterStatusCampos() {
  const camp = estado.camposLivres;
  const lista = [];

  lista.push({ descricao: "Nome completo",                                 ok: !!camp.nomeAluno.trim(),     elementoId: "inp-nomeAluno" });
  lista.push({ descricao: "RG",                                            ok: !!camp.rg.trim(),            elementoId: "inp-rg" });
  lista.push({ descricao: "CPF (formato 000.000.000-00)",                  ok: cpfValido(camp.cpf),         elementoId: "inp-cpf" });
  lista.push({
    descricao: "Prontuário (2 letras + números, ex.: RQ3051595)",
    ok: !!camp.prontuario.trim() && /^[A-Z]{2}\d+$/.test(camp.prontuario),
    elementoId: "inp-prontuario"
  });
  lista.push({ descricao: "Data de nascimento (não futura, idade plausível)", ok: dataNascimentoValida(camp.dataNasc), elementoId: "inp-dataNasc" });
  lista.push({ descricao: "Endereço",                                      ok: !!camp.enderecoAluno.trim(), elementoId: "inp-enderecoAluno" });
  lista.push({ descricao: "CEP (formato 00000-000)",                       ok: cepValido(camp.cepAluno),    elementoId: "inp-cepAluno" });
  lista.push({ descricao: "Bairro",                                        ok: !!camp.bairroAluno.trim(),   elementoId: "inp-bairroAluno" });
  lista.push({ descricao: "Cidade",                                        ok: !!camp.cidadeAluno.trim(),   elementoId: "inp-cidadeAluno" });
  lista.push({
    descricao: "Telefone ou Celular (com DDD)",
    ok: telefoneValido(camp.telefoneAluno) || celularValido(camp.celularAluno),
    elementoId: "inp-celularAluno"
  });
  lista.push({ descricao: "E-mail (formato válido)", ok: emailValido(camp.emailPessoal),  elementoId: "inp-emailPessoal" });

  // Escola
  if (!estado.escola) {
    lista.push({ descricao: "Escola (Unidade Concedente)", ok: false, elementoId: "sel-escola" });
    lista.push({ descricao: "Supervisor(a) na escola",     ok: false, elementoId: "sel-supervisor" });
  } else if (estado.escola === "outra") {
    lista.push({ descricao: "Escola (Unidade Concedente)", ok: true, elementoId: "sel-escola" });
    const e = estado.camposEscolaLivres;
    lista.push({ descricao: "Nome da escola (manual)",            ok: !!e.nome.trim(),               elementoId: "inp-esc-nome" });
    lista.push({ descricao: "CNPJ da escola (manual)",            ok: !!e.cnpj.trim(),               elementoId: "inp-esc-cnpj" });
    lista.push({ descricao: "Endereço da escola (manual)",        ok: !!e.endereco.trim(),           elementoId: "inp-esc-endereco" });
    lista.push({ descricao: "Representante legal (manual)",       ok: !!e.representanteLegal.trim(), elementoId: "inp-esc-representanteLegal" });
    lista.push({ descricao: "Nome do(a) supervisor(a) (manual)",  ok: !!e.supervisorNome.trim(),     elementoId: "inp-esc-supervisorNome" });
  } else {
    lista.push({ descricao: "Escola (Unidade Concedente)", ok: true, elementoId: "sel-escola" });
    if (estado.supervisor === "manual") {
      lista.push({ descricao: "Supervisor(a) na escola", ok: true, elementoId: "sel-supervisor" });
      const s = estado.camposSupervisorLivres;
      lista.push({ descricao: "Nome do(a) supervisor(a) (manual)",   ok: !!s.nome.trim(),         elementoId: "inp-sup-nome" });
      lista.push({ descricao: "E-mail do(a) supervisor(a) (manual)", ok: emailValido(s.email),    elementoId: "inp-sup-email" });
    } else {
      lista.push({ descricao: "Supervisor(a) na escola", ok: !!estado.supervisor, elementoId: "sel-supervisor" });
    }
  }

  // Período do estágio
  lista.push({ descricao: "Data de início do estágio",   ok: camp.estagioInicio.length === 10, elementoId: "inp-estagioInicio" });
  lista.push({ descricao: "Data de término do estágio",  ok: camp.estagioFim.length === 10,    elementoId: "inp-estagioFim" });
  lista.push({ descricao: "Período do estágio (turno)",  ok: !!camp.periodoEstagio,            elementoId: "periodo-estagio-grid" });

  // Orientador
  if (!estado.orientador) {
    lista.push({ descricao: "Orientador(a) no IFSP", ok: false, elementoId: "sel-orientador" });
  } else if (estado.orientador === "manual") {
    lista.push({ descricao: "Orientador(a) no IFSP", ok: true, elementoId: "sel-orientador" });
    const o = estado.camposOrientadorLivres;
    lista.push({ descricao: "Nome do(a) orientador(a) (manual)",   ok: !!o.nome.trim(),       elementoId: "inp-orient-nome" });
    lista.push({ descricao: "E-mail do(a) orientador(a) (manual)", ok: emailValido(o.email),  elementoId: "inp-orient-email" });
  } else {
    lista.push({ descricao: "Orientador(a) no IFSP", ok: true, elementoId: "sel-orientador" });
  }

  // Plano
  lista.push({ descricao: "Pelo menos um semestre no plano", ok: estado.semestres.length > 0, elementoId: "semestres-container" });
  lista.push({ descricao: "Carga horária diária",            ok: !!camp.cargaDiaria,          elementoId: "inp-cargaDiaria" });

  return lista;
}

/**
 * Mantida por compatibilidade — retorna apenas as descrições dos faltantes.
 */
function obterCamposFaltantes() {
  return obterStatusCampos().filter(s => !s.ok).map(s => s.descricao);
}

/**
 * Exibe o modal listando os campos não preenchidos.
 */
function exibirModalCampos(faltam) {
  const modal = document.getElementById("modal-campos");
  const lista = document.getElementById("modal-lista-campos");
  if (!modal || !lista) {
    // Fallback se o modal não estiver disponível
    alert("Faltam preencher:\n\n- " + faltam.join("\n- "));
    return;
  }
  lista.innerHTML = faltam.map(f => `<li>${f}</li>`).join("");
  modal.classList.add("aberto");
}

function fecharModalCampos() {
  const modal = document.getElementById("modal-campos");
  if (modal) modal.classList.remove("aberto");
}

/**
 * Tenta executar a ação (imprimir ou baixar). Se faltam campos, exibe modal.
 */
function executarComValidacao(acao) {
  const faltam = obterCamposFaltantes();
  if (faltam.length > 0) {
    exibirModalCampos(faltam);
    return;
  }
  acao();
}

// =========================================================================
// Construção do termo (HTML para preview e impressão)
// =========================================================================
function obterDadosOrientador() {
  if (estado.orientador === "manual") {
    return {
      nome: estado.camposOrientadorLivres.nome || "[preencher]",
      email: estado.camposOrientadorLivres.email || "[preencher]"
    };
  } else if (estado.orientador) {
    return { nome: estado.orientador.nome, email: estado.orientador.email };
  }
  return null;
}

function obterDadosEscola() {
  if (estado.escola === "outra") {
    return {
      nome: estado.camposEscolaLivres.nome || "[preencher]",
      cnpj: estado.camposEscolaLivres.cnpj || "[preencher]",
      endereco: estado.camposEscolaLivres.endereco || "[preencher]",
      cep: estado.camposEscolaLivres.cep || "[preencher]",
      bairro: estado.camposEscolaLivres.bairro || "[preencher]",
      cidade: estado.camposEscolaLivres.cidade || "[preencher]",
      estado: estado.camposEscolaLivres.estado || "SP",
      representanteLegal: estado.camposEscolaLivres.representanteLegal || "[preencher]",
      cargoRepresentante: estado.camposEscolaLivres.cargoRepresentante || "[preencher]",
      periodoEstagio: estado.camposEscolaLivres.periodoEstagio || "[preencher]",
      supervisor: {
        nome: estado.camposEscolaLivres.supervisorNome || "[preencher]",
        funcao: estado.camposEscolaLivres.supervisorFuncao || "[preencher]",
        telefone: estado.camposEscolaLivres.supervisorTelefone || "_____________",
        email: estado.camposEscolaLivres.supervisorEmail || "[preencher]"
      }
    };
  } else if (estado.escola) {
    // Resolve o supervisor (cadastrado ou digitado manualmente)
    let supervisor;
    if (estado.supervisor === "manual") {
      const s = estado.camposSupervisorLivres;
      supervisor = {
        nome: s.nome || "[preencher]",
        funcao: "",
        telefone: "_____________",
        email: s.email || "[preencher]"
      };
    } else {
      supervisor = estado.supervisor || {
        nome: "[selecione o(a) supervisor(a)]",
        funcao: "",
        telefone: "_____________",
        email: ""
      };
    }
    return {
      nome: estado.escola.nome,
      cnpj: estado.escola.cnpj || "[preencher]",
      endereco: estado.escola.endereco || "[preencher]",
      cep: estado.escola.cep || "[preencher]",
      bairro: estado.escola.bairro || "[preencher]",
      cidade: estado.escola.cidade || "[preencher]",
      estado: estado.escola.estado || "SP",
      representanteLegal: estado.escola.representanteLegal || "[preencher]",
      cargoRepresentante: estado.escola.cargoRepresentante || "[preencher]",
      periodoEstagio: estado.escola.periodoEstagio || "[preencher]",
      supervisor: supervisor
    };
  }
  return null;
}

function atualizarPreview() {
  const html = construirHtmlTermo();
  document.getElementById("preview-area").innerHTML = html;
  atualizarIndicadoresProgresso();
}

/**
 * Aplica destaques visuais aos campos obrigatórios:
 * - .campo-pendente nos não preenchidos (borda colorida)
 * - .campo-ok nos preenchidos
 * Atualiza também a barra de progresso e o contador no topo.
 */
function atualizarIndicadoresProgresso() {
  const status = obterStatusCampos();
  status.forEach(s => {
    const el = document.getElementById(s.elementoId);
    if (!el) return;
    const container = el.closest(".campo") || el;
    container.classList.toggle("campo-ok", s.ok);
    container.classList.toggle("campo-pendente", !s.ok);
  });

  const total = status.length;
  const preenchidos = status.filter(s => s.ok).length;
  const pct = total > 0 ? Math.round((preenchidos / total) * 100) : 0;

  const barra = document.getElementById("barra-progresso-fill");
  const texto = document.getElementById("barra-progresso-texto");
  if (barra) barra.style.width = pct + "%";
  if (texto) texto.textContent = `${preenchidos} de ${total} campos obrigatórios preenchidos (${pct}%)`;
}

function construirHtmlTermo() {
  const camp = estado.camposLivres;
  // "aluno" agora é construído a partir dos campos livres
  const aluno = {
    nome: camp.nomeAluno || "",
    rg: camp.rg || "",
    prontuario: camp.prontuario || "",
    dataNasc: camp.dataNasc || ""
  };
  const dadosEscola = obterDadosEscola();
  const orientador = obterDadosOrientador();
  const data = estado.dataAssinatura;

  // Cláusula VII - novo formato com datas, turno e duração
  const dataIni = camp.estagioInicio || "XX/XX/20XX";
  const dataFim = camp.estagioFim || "XX/XX/20XX";
  const periodoEstagioMarcado = camp.periodoEstagio || "";
  const marca = (turno) => periodoEstagioMarcado === turno ? "X" : " ";
  const clausulaVIITxt =
    `O estágio será desenvolvido no período de <strong>${dataIni}</strong> a <strong>${dataFim}</strong>, ` +
    `no período: ( ${marca("Matutino")} ) Matutino, ( ${marca("Vespertino")} ) Vespertino, ` +
    `( ${marca("Integral")} ) Integral, ( ${marca("Noturno")} ) Noturno, ` +
    `podendo ser prorrogado por meio de Termo Aditivo. Ressaltam-se aqui os limites para jornada de estágio, ` +
    `estabelecidos no artigo 10º da Lei 11.788/2008, que não deve ultrapassar 6 (seis) horas diárias e 30 (trinta) horas semanais. ` +
    `A jornada de estágio na Unidade Concedente também não poderá coincidir com os horários de aulas do(a) estudante/estagiário(a) no curso de Licenciatura.`;
  // Texto resumido do período (usado em outros pontos do documento, como o Plano de Atividades)
  const periodoBase = dadosEscola ? dadosEscola.periodoEstagio : "[a definir]";
  let periodoEstagioTxt = periodoEstagioMarcado || periodoBase;
  if (camp.cargaDiaria) periodoEstagioTxt += `, com carga horária diária de ${camp.cargaDiaria}h`;

  // Cláusula VIII - apólice
  const clausulaVIII = CLAUSULAS.find(c => c.numero === "VIII");
  const clausulaVIIITxt = clausulaVIII.textoPrefixo +
    `<strong>coberto pela apólice de seguro nº ${SEGURO.numero}</strong>` +
    clausulaVIII.textoSufixo
      .replace("{{SEGURO_SEGURADORA}}", SEGURO.seguradora)
      .replace("{{SEGURO_CNPJ}}", SEGURO.cnpjSeguradora)
      .replace("{{SEGURO_INICIO}}", SEGURO.vigenciaInicio)
      .replace("{{SEGURO_FIM}}", SEGURO.vigenciaFim)
      .replace("{{SEGURO_VALOR}}", SEGURO.valorCobertura);

  // PCD - sem campo de especificação
  const pcdSim = camp.pcd === "Sim";
  const pcdMarcacao = pcdSim
    ? `[X] Sim [ ] Não`
    : `[ ] Sim [X] Não`;

  // Plano de atividades
  const linhasPlano = [];
  let totalCarga = 0;
  estado.semestres.forEach(s => {
    const sem = ATIVIDADES_POR_SEMESTRE[s];
    totalCarga += sem.cargaTotal;
    sem.atividades.forEach(at => {
      linhasPlano.push(`
        <tr>
          <td>${sem.rotulo}</td>
          <td>${at.carga}</td>
          <td>${at.sintese}</td>
        </tr>`);
    });
  });

  const detalheTotal = estado.semestres.length > 1
    ? ` (${estado.semestres.map(s => ATIVIDADES_POR_SEMESTRE[s].cargaTotal + "h referentes ao " + ATIVIDADES_POR_SEMESTRE[s].rotulo).join(", ")})`
    : "";

  // Demais cláusulas (texto simples)
  const clausulasHtml = CLAUSULAS.filter(c =>
    !["VII", "VIII"].includes(c.numero)
  ).map(c => {
    if (c.numero === "XII-itens") {
      return `<div class="termo-bloco">${c.texto}</div>`;
    }
    return `<div class="termo-bloco">CLÁUSULA ${c.numero} - ${c.texto}</div>`;
  });
  // Inserir VII e VIII nas posições corretas (depois de VI e antes de IX)
  const idxVII = clausulasHtml.findIndex(s => s.includes("CLÁUSULA VI -"));
  clausulasHtml.splice(idxVII + 1, 0, `<div class="termo-bloco">CLÁUSULA VII - ${clausulaVIITxt}</div>`);
  const idxVIII = clausulasHtml.findIndex(s => s.includes("CLÁUSULA IX -"));
  clausulasHtml.splice(idxVIII, 0, `<div class="termo-bloco">CLÁUSULA VIII - ${clausulaVIIITxt}</div>`);

  return `
    <div class="termo-cabecalho">
      <img src="brasao.jpg" alt="Brasão do Ministério da Educação">
      <p class="linha-cab">Ministério da Educação</p>
      <p class="linha-cab">Instituto Federal de Educação, Ciência e Tecnologia de São Paulo</p>
      <p class="linha-cab">Campus São Roque</p>
    </div>

    <h1 class="termo-titulo">TERMO DE COMPROMISSO E PLANO DE ATIVIDADES DE ESTÁGIO – LICENCIATURA EM PEDAGOGIA</h1>

    <div class="termo-bloco">
      <strong>INSTITUIÇÃO DE ENSINO</strong><br>
      <strong>Instituição:</strong> ${INSTITUICAO.nome}.
      <strong>Endereço:</strong> ${INSTITUICAO.endereco}.
      <strong>Telefone:</strong> ${INSTITUICAO.telefone}.
      <strong>CNPJ:</strong> ${INSTITUICAO.cnpj}.
      Representada pelo seu Diretor Geral, Prof. ${INSTITUICAO.diretorGeral}, nomeado pela ${INSTITUICAO.portariaDiretor}.
    </div>

    <div class="termo-bloco">
      <strong>IDENTIFICAÇÃO DO(A) PROFESSOR(A) ORIENTADOR(A)</strong> no IFSP<br>
      <strong>Nome:</strong> ${orientador ? orientador.nome : "[selecione o(a) orientador(a)]"}<br>
      <strong>E-mail:</strong> ${orientador ? orientador.email : ""}
    </div>

    <div class="termo-bloco">
      <strong>UNIDADE CONCEDENTE</strong><br>
      <strong>Unidade de Ensino:</strong> ${dadosEscola ? dadosEscola.nome : "[selecione a escola]"}.
      <strong>CNPJ:</strong> ${dadosEscola ? dadosEscola.cnpj : ""} (doravante denominada CONCEDENTE).
      <strong>Endereço:</strong> ${dadosEscola ? dadosEscola.endereco : ""}.
      <strong>CEP:</strong> ${dadosEscola ? dadosEscola.cep : ""}.
      <strong>Bairro:</strong> ${dadosEscola ? dadosEscola.bairro : ""}.
      <strong>Cidade:</strong> ${dadosEscola ? dadosEscola.cidade : ""}.
      <strong>Estado:</strong> ${dadosEscola ? dadosEscola.estado : "SP"}.
      <strong>Representante legal:</strong> ${dadosEscola ? dadosEscola.representanteLegal : ""}.
      <strong>Cargo:</strong> ${dadosEscola ? dadosEscola.cargoRepresentante : ""}.
    </div>

    <div class="termo-bloco">
      <strong>INFORMAÇÕES DA SUPERVISORA/SUPERVISOR</strong> (da unidade concedente)<br>
      <strong>Nome:</strong> ${dadosEscola && dadosEscola.supervisor ? dadosEscola.supervisor.nome : ""}.
      <strong>Função:</strong> ${dadosEscola && dadosEscola.supervisor ? dadosEscola.supervisor.funcao : ""}.
      <strong>Telefone:</strong> ${dadosEscola && dadosEscola.supervisor ? (dadosEscola.supervisor.telefone || "_____________") : "_____________"}.
      <strong>E-mail:</strong> ${dadosEscola && dadosEscola.supervisor ? dadosEscola.supervisor.email : ""}.
    </div>

    <div class="termo-bloco">Acordam entre si o Termo de Convênio de Concessão de Estágio conforme declaram nas cláusulas a seguir:</div>

    <div class="termo-bloco">CLÁUSULA I - ${CLAUSULAS.find(c => c.numero === "I").texto}</div>
    <div class="termo-bloco">CLÁUSULA II - ${CLAUSULAS.find(c => c.numero === "II").texto}</div>

    <div class="termo-bloco">
      <strong>ESTUDANTE/ESTAGIÁRIO</strong><br>
      <strong>Nome:</strong> ${aluno.nome || "[preencher]"}.
      <strong>Curso:</strong> Licenciatura em PEDAGOGIA.
      <strong>Período:</strong> ${camp.periodoCurso || "Noturno"}.
      <strong>Prontuário:</strong> ${aluno.prontuario || "[preencher]"}.
      <strong>RG:</strong> ${aluno.rg || "[preencher]"}.
      <strong>CPF:</strong> ${camp.cpf || "[preencher]"}.
      <strong>Data de Nascimento:</strong> ${aluno.dataNasc || "[preencher]"}.
      <strong>Endereço:</strong> ${camp.enderecoAluno || "[preencher]"}.
      <strong>CEP:</strong> ${camp.cepAluno || "[preencher]"}.
      <strong>Bairro:</strong> ${camp.bairroAluno || "[preencher]"}.
      <strong>Cidade:</strong> ${camp.cidadeAluno || "[preencher]"}.
      <strong>Estado:</strong> ${camp.estadoAluno || "SP"}.
      <strong>Telefone:</strong> ${camp.telefoneAluno || "[preencher]"}.
      <strong>Celular:</strong> ${camp.celularAluno || "[preencher]"}.
      <strong>E-mail:</strong> ${camp.emailPessoal || "[preencher]"}.
      <strong>Estágio:</strong> [X] Obrigatório [ ] Não Obrigatório.
      <strong>Pessoa com deficiência:</strong> ${pcdMarcacao}.
    </div>

    <div class="termo-bloco">A UNIDADE CONCEDENTE, com a intervenção da INSTITUIÇÃO DE ENSINO e, de outro lado, o ESTUDANTE/ESTAGIÁRIO abaixo:</div>
    <div class="termo-bloco">Ajustam entre si este TERMO DE COMPROMISSO DE ESTÁGIO que se regerá pelas cláusulas a seguir:</div>

    ${clausulasHtml.join("\n")}

    <div class="termo-bloco">E, por estarem de acordo com as condições deste Termo, as partes o assinam em três vias de igual teor e forma, para que surta seus efeitos legais.</div>

    <div class="termo-bloco">São Roque, ${data.dia} de ${data.mes} de ${data.ano}.</div>

    <div class="assinaturas">
      <p style="font-weight: bold;">ASSINATURAS</p>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Supervisor(a) da Unidade Concedente</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Representante Legal da Unidade Concedente</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Estudante/Estagiário(a)</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Orientador(a) de estágio</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">${INSTITUICAO.diretorGeral} - Diretor Geral do IFSP - Câmpus São Roque</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">${INSTITUICAO.coordenadora} - Coordenadora do Curso</span></div>
    </div>

    <p class="rodape-doc">Documento assinado eletronicamente conforme Art. 6º, Inciso I, do Regulamento de Estágio – Portaria 1.204, de 11/05/2011.</p>

    ${estado.semestres.length > 0 ? `
    <div class="quebra-pagina"></div>

    <h1 class="termo-titulo">PLANO DE ATIVIDADES</h1>

    <div class="termo-bloco">
      <strong>Estudante/Estagiário:</strong> ${aluno.nome || "[preencher]"}.
      <strong>Curso - Licenciatura em:</strong> Pedagogia.
      <strong>Prontuário:</strong> ${aluno.prontuario || "[preencher]"}.
      <strong>Período do Estágio:</strong> ${periodoEstagioTxt}.
      <strong>Estabelecimento de Ensino:</strong> ${dadosEscola ? dadosEscola.nome : ""}.
    </div>

    <p style="text-align: center; font-weight: bold;">ATIVIDADES A SEREM DESENVOLVIDAS</p>

    <table class="termo-tabela">
      <thead>
        <tr><th>PERÍODO DO CURSO</th><th>CARGA HORÁRIA</th><th>SÍNTESE DAS ATIVIDADES A SEREM DESENVOLVIDAS</th></tr>
      </thead>
      <tbody>
        ${linhasPlano.join("\n")}
      </tbody>
    </table>

    <p><strong>Total Carga Horária desta folha:</strong> ${totalCarga}h${detalheTotal}</p>

    <div class="assinaturas">
      <p style="font-weight: bold;">ASSINATURAS</p>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Supervisor(a) de Estágio</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Representante Legal da Unidade Concedente</span></div>
      <div class="linha-assinatura"><div class="traco"></div><span class="legenda">Orientador(a) do Estágio no IFSP</span></div>
    </div>
    ` : '<p class="aviso">Selecione ao menos um semestre para gerar o Plano de Atividades.</p>'}
  `;
}

// =========================================================================
// Geração do arquivo .doc (HTML embarcado, abre nativamente no Word,
// Google Docs e LibreOffice — não depende de bibliotecas externas)
// =========================================================================

/**
 * Carrega o brasão e converte para base64. Retorna data URI completa
 * ("data:image/jpeg;base64,...") ou null se falhar.
 */
async function carregarBrasaoBase64() {
  try {
    const resp = await fetch("brasao.jpg");
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Não foi possível carregar o brasão:", e);
    return null;
  }
}

/**
 * Constrói o HTML completo do termo, pronto para ser salvo como .doc.
 * Inclui estilos inline e brasão embutido em base64.
 */
async function construirHtmlParaDoc() {
  const brasaoDataUrl = await carregarBrasaoBase64();
  const conteudo = construirHtmlTermo();
  // Substitui a referência ao arquivo brasao.jpg pela versão em base64,
  // garantindo que a imagem apareça mesmo após o aluno mover o arquivo .doc
  const conteudoComBrasao = brasaoDataUrl
    ? conteudo.replace(/src="brasao\.jpg"/g, `src="${brasaoDataUrl}"`)
    : conteudo.replace(/<img[^>]*brasao\.jpg[^>]*>/g, "");

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<title>Termo de Compromisso de Estágio</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
  size: A4;
  margin: 22mm 20mm 20mm 20mm;
  mso-page-numbers: 1;
  mso-header-margin: 12mm;
  mso-footer-margin: 12mm;
  mso-paper-source: 0;
  mso-page-orientation: portrait;
}
@page {
  mso-header: h1;
}
div.Section1 { page: Section1; }
body {
  font-family: "Times New Roman", Georgia, serif;
  font-size: 11pt;
  line-height: 1.45;
  color: #000;
  margin: 0;
}
p, div { margin: 0 0 8pt 0; }
.termo-cabecalho {
  text-align: center;
  margin-bottom: 10pt;
}
.termo-cabecalho img {
  width: 70px;
  height: auto;
}
.linha-cab { font-weight: bold; margin: 0; line-height: 1.3; }
.termo-titulo {
  text-align: center;
  font-weight: bold;
  font-size: 12pt;
  margin: 10pt 0 14pt 0;
}
.termo-bloco {
  margin: 10pt 0;
  text-align: justify;
}
.termo-tabela {
  width: 100%;
  border-collapse: collapse;
  margin: 10pt 0;
  mso-table-lspace: 0;
  mso-table-rspace: 0;
}
.termo-tabela th, .termo-tabela td {
  border: 1pt solid #000;
  padding: 4pt 6pt;
  font-size: 10pt;
  vertical-align: top;
}
.termo-tabela th { background: #f0f0f0; text-align: center; font-weight: bold; }
.termo-tabela tr { mso-row-break: auto; }
.assinaturas { text-align: center; margin-top: 18pt; }
.assinaturas p { font-weight: bold; }
.assinaturas .linha-assinatura { margin: 14pt 0; mso-row-break: avoid; }
.assinaturas .traco {
  display: inline-block;
  border-top: 1pt solid #000;
  width: 280pt;
  margin-bottom: 2pt;
}
.assinaturas .legenda { display: block; font-style: italic; font-size: 10pt; }
.rodape-doc { font-size: 9pt; margin-top: 18pt; color: #444; }
.quebra-pagina {
  page-break-before: always;
  mso-special-character: line-break;
}
</style>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
  <w:View>Print</w:View>
</w:WordDocument>
</xml>
<![endif]-->
</head>
<body>
<div class="Section1">
${conteudoComBrasao}
</div>
</body>
</html>`;
}

/**
 * Gera e baixa o termo como arquivo .doc.
 */
async function baixarDoc() {
  const camp = estado.camposLivres;
  const dadosEscola = obterDadosEscola();

  try {
    const html = await construirHtmlParaDoc();
    // BOM ﻿ garante que o Word interprete UTF-8 corretamente
    const blob = new Blob(["﻿", html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const nomeAluno = (camp.nomeAluno || "Estagiario").replace(/\s+/g, "_");
    const nomeEscola = dadosEscola && dadosEscola.nome ? dadosEscola.nome.replace(/\s+/g, "_") : "Escola";
    a.href = url;
    a.download = `Termo_${nomeAluno}_${nomeEscola}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    console.error("Erro ao gerar o documento:", e);
    alert("Ocorreu um erro ao gerar o documento. Tente novamente ou use a opção 'Imprimir / Salvar como PDF'.");
  }
}
