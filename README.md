# Gerador de Termo de Compromisso de Estágio

Sistema web para geração do Termo de Compromisso e Plano de Atividades de Estágio, destinado ao curso de Licenciatura em Pedagogia do IFSP, campus São Roque.

## Como utilizar

Abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari). O sistema funciona localmente, sem necessidade de servidor ou instalação, e não envia dados pela internet.

O preenchimento segue cinco etapas: identificação do estudante, seleção da escola, escolha do(a) orientador(a) no IFSP, marcação dos semestres do plano de atividades e definição da data do termo. A pré-visualização do documento é atualizada automaticamente ao lado, conforme o formulário é preenchido.

Ao final, há duas opções de saída: o botão "Imprimir / Salvar como PDF" abre a janela de impressão do navegador (basta escolher "Salvar como PDF" no destino) e o botão "Baixar em formato .doc caso prefira editar o documento" gera um arquivo editável compatível com o Microsoft Word, Google Docs e LibreOffice. Em tabelas longas (com vários semestres selecionados), as linhas podem se distribuir entre páginas, evitando espaços em branco.

## Estrutura dos arquivos

A pasta contém quatro arquivos principais. O `index.html` é a interface, o `estilos.css` define a aparência e as regras de impressão, o `app.js` contém a lógica de preenchimento e geração do documento, e o `dados.js` reúne todos os dados fixos do sistema (estudantes, escolas, orientadores, atividades por semestre, cláusulas do termo, informações da instituição e da apólice de seguro).

## Atualização dos dados

Para adicionar ou modificar estudantes, escolas, orientadores ou atividades, basta editar diretamente o arquivo `dados.js` em um editor de texto. Cada bloco está claramente identificado por comentários.

Os campos pessoais e sensíveis (CPF, endereço, telefones) não ficam armazenados no sistema, sendo preenchidos pelo estudante a cada uso, em conformidade com a Lei Geral de Proteção de Dados (LGPD).

## Bibliotecas externas

O sistema utiliza a biblioteca `docx-js` (v9.5.1), carregada via CDN (unpkg), para a geração dos arquivos Word. Caso o computador não tenha conexão com a internet no momento, a função de download em `.docx` ficará indisponível; nesse caso, a opção de impressão/PDF continua funcionando normalmente.

## Privacidade

Todo o processamento ocorre no navegador do próprio usuário. Os dados preenchidos não são enviados a nenhum servidor e não persistem entre sessões: ao fechar a aba, todas as informações digitadas são descartadas.
