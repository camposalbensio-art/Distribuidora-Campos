# Distribuidora Campos — Cardápio Digital

Cardápio digital (`index.html`) + Painel do Dono (`admin.html`), com Firebase
como banco de dados/armazenamento de fotos.

## Arquivos
- `index.html` + `app.js` — cardápio que o cliente vê
- `admin.html` + `admin.js` — painel do dono (produtos, comandas, configurações, importação de backup)
- `style.css` — visual (tema dark + dourado), usado pelos dois
- `firebase-config.js` — já preenchido com as chaves do projeto `distribuidora-campos`
- `logo.png` — logo da Distribuidora Campos (coloque este arquivo na pasta)

## Passo 1 — Regras do Firestore
As chaves do Firebase já estão configuradas em `firebase-config.js`. Falta só liberar
as regras de acesso do banco, senão o site roda mas não consegue ler/gravar nada.

Este projeto **não usa Firebase Storage** — roda 100% no plano gratuito (Spark).
As fotos são salvas como texto Base64 (comprimidas via Canvas, máx. 400x400,
JPEG qualidade 0.75) direto no campo `imagemUrl` de cada produto no Firestore.
Só precisa mexer nas regras do **Firestore Database** mesmo.

No [Console do Firebase](https://console.firebase.google.com) → projeto `distribuidora-campos`
→ **Firestore Database → Regras**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produtos/{id}     { allow read: if true; allow write: if true; }
    match /categorias/{id}   { allow read: if true; allow write: if true; }
    match /pedidos/{id}      { allow read: if true; allow create: if true; allow update, delete: if true; }
    match /config/{id}       { allow read: if true; allow write: if true; }
  }
}
```

⚠️ **Importante:** essas regras liberam escrita pra qualquer pessoa que
descobrir a URL do seu projeto — ótimo pra testar rápido, mas não é seguro
pra produção. O ideal, quando o site já estiver rodando bem, é:
- Ativar o **Firebase Authentication** (login por e-mail/senha) só pro admin.
- Trocar as regras de `produtos`, `categorias` e `config` para
  `allow write: if request.auth != null;` (só quem estiver logado escreve).
- `pedidos` pode manter `create: if true` (cliente sem login cria pedido),
  mas `update/delete` só para autenticado (o dono, no painel).

A senha simples em `firebase-config.js` (`ADMIN_SENHA`) é só uma trava de
tela — não impede alguém de escrever direto no banco se as regras estiverem
abertas. Reforce com Authentication assim que puder.

## Passo 2 — Importar backup (opcional)
1. Abra `admin.html` e entre com a senha (`ADMIN_SENHA` em `firebase-config.js`,
   valor padrão: `Campos@2026` — troque antes de publicar).
2. Vá na aba **Configurações → Importar backup do sistema antigo**.
3. Selecione o arquivo `.json` do seu backup e clique em **Importar arquivo**.
4. Aguarde a barra de progresso — cada produto é gravado como um documento
   no Firestore (a foto já vem em Base64 do backup antigo, sem upload a
   nenhum lugar), então é rápido mesmo com muitos produtos.

O que a importação faz:
- Cria as categorias do backup (sem duplicar as que já existem).
- Cria/atualiza cada produto (nome, categoria, preço, disponibilidade e foto em Base64).
- Preenche o WhatsApp da loja em Configurações, a partir do `telefoneLoja` do backup.
- Pode rodar de novo sem medo: produtos e categorias são identificados por
  código/nome, então uma nova importação **atualiza** em vez de duplicar.

Depois de importar, revise a aba **Produtos** — o campo "Volume/descrição"
vem em branco (o backup antigo não tinha esse campo separado do nome), então
edite os produtos que quiser deixar mais detalhados.

## Passo 3 — Publicar o site
Como é só HTML/CSS/JS, qualquer hospedagem estática serve. Mais simples:
- **Firebase Hosting** (fica tudo no mesmo projeto): `firebase init hosting`
  → `firebase deploy`.
- Ou: Netlify, Vercel, GitHub Pages — basta subir os arquivos da pasta
  (incluindo `logo.png`).

## Sobre as fotos (Base64, sem Storage)
- Ao cadastrar/editar um produto pelo painel, a foto escolhida é **comprimida
  no navegador** (redimensionada para no máximo 400x400px, JPEG qualidade
  0.75) antes de ser salva como texto Base64 no Firestore. Isso mantém o
  arquivo pequeno e evita qualquer custo de Storage.
- Fotos importadas do backup antigo (`p.image`) são gravadas como já vêm,
  sem recomprimir — na prática já costumam ser pequenas o suficiente.
- O Firestore tem um limite de 1 MB por documento. Uma foto bem comprimida
  fica bem abaixo disso, mas se algum produto específico não salvar, o
  motivo mais provável é uma imagem de origem muito grande — nesse caso,
  edite o produto e escolha a foto de novo pelo painel (ela passa pela
  compressão automática).

## Observações técnicas
- O carrinho fica só na memória da aba (não usa localStorage/sessionStorage
  para os itens do carrinho, por segurança e compatibilidade).
- Login do admin usa `sessionStorage` — some ao fechar a aba/navegador.
- O som de novo pedido é gerado por código (Web Audio API), não depende de
  arquivo de áudio externo.
- Categorias, produtos, pedidos e status da loja são editáveis 100% pelo
  painel — nada fica "fixo" no código, exceto as chaves do Firebase.

