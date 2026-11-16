# Uma surpresa de Natal

Uma experiência web feita apenas com HTML, CSS e JavaScript.

## Personalizar

Abra `js/script.js` e edite o objeto `CONFIG`:

- `tracks`: altere os nomes e os caminhos das três faixas. Os ficheiros de demonstração em `music/` são WAV; também pode substituir os caminhos por ficheiros MP3.
- `photos`: por predefinição, o carrossel procura `images/1.jpg` até `images/8.jpg`. Coloque as suas fotografias nessa pasta e aumente o número em `Array.from({ length: 8 }, ...)` se tiver mais. Os caminhos não precisam de ser sequenciais: pode editar a lista diretamente.
- `templateAcores.docx` e `templateAcores.docx.pdf`: o botão «Quero!» abre `preview.html`, que apresenta o PDF para preservar a formatação do Word. O botão de download descarrega o DOCX original. Se atualizar o Word, exporte novamente o PDF com o mesmo nome para atualizar a pré-visualização.

Como o site é estático, os browsers não podem descobrir automaticamente os ficheiros de uma pasta. A lista em `CONFIG.photos` deixa explícito quantas fotografias existem; se uma imagem ainda não estiver disponível, é apresentada uma ilustração de demonstração.

## Executar

Abra `index.html` num browser moderno ou sirva a pasta com qualquer servidor HTTP estático. A primeira seleção de música revela a galeria, mas não inicia o áudio. Use Play para começar e Pause para interromper.
