# Guia rápido — Controle do Tríduo (Financeiro + Camisas)

Este app guarda tudo num banco de dados **Supabase** grátis, na nuvem. Todas as pessoas que tiverem **login** veem os mesmos dados, atualizados ao vivo. Você configura **uma vez** e depois é só usar.

O sistema tem duas áreas:

- **💰 Financeiro** — receitas e despesas, com categorias, forma de pagamento (Dinheiro/Pix/Cartão) e comprovante anexado.
- **👕 Camisas** — estoque por tamanho, vendas (quem comprou), pago/parcial/pendente, entregue/não, forma de pagamento e comprovante.

O valor recebido das camisas entra **automaticamente** nas receitas do saldo geral.

Tempo de instalação: ~10 minutos, sem rodar nada no computador.

---

## Passo 1 — Criar a conta e o projeto

1. Acesse **https://supabase.com** → **Start your project** (dá para entrar com o Google).
2. Clique em **New project**, dê um nome (ex.: `triduo`), crie uma **senha do banco** (guarde) e escolha a região mais perto (ex.: *South America (São Paulo)*).
3. Clique em **Create new project** e aguarde ~1 minuto.

## Passo 2 — Criar as tabelas e o armazenamento

1. No menu à esquerda, abra **SQL Editor** → **New query**.
2. Cole o código abaixo e clique em **Run**:

```sql
-- Tabelas
create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null, tipo text not null default 'ambos',
  created_at timestamptz default now());

create table if not exists lancamentos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('receita','despesa')),
  descricao text, valor numeric not null, categoria text,
  forma text, comprovante_url text,
  data date not null default current_date, responsavel text,
  created_at timestamptz default now());

create table if not exists camisas_estoque (
  id uuid primary key default gen_random_uuid(),
  tamanho text not null, quantidade int not null, obs text,
  created_at timestamptz default now());

create table if not exists camisas_vendas (
  id uuid primary key default gen_random_uuid(),
  comprador text, tamanho text not null, quantidade int not null default 1,
  valor_unit numeric not null default 0, valor_total numeric not null default 0,
  valor_pago numeric not null default 0, pagamentos jsonb not null default '[]'::jsonb,
  forma text, entregue boolean not null default false, entregue_em date, entrega_obs text,
  comprovante_url text, responsavel text, data date not null default current_date, obs text,
  created_at timestamptz default now());

create table if not exists triduo_lancamentos (
  id uuid primary key default gen_random_uuid(),
  noite text not null, grupo text not null, descricao text,
  valor numeric not null, forma text, responsavel text,
  data date not null default current_date, created_at timestamptz default now());

create table if not exists transferencias (
  id uuid primary key default gen_random_uuid(),
  valor numeric not null,
  sentido text not null check (sentido in ('caixa_conta','conta_caixa','conta_conta')),
  data date not null default current_date, obs text,
  created_at timestamptz default now());

create table if not exists reembolsos (
  id uuid primary key default gen_random_uuid(),
  descricao text, pessoa text, valor numeric not null, categoria text,
  data date not null default current_date, comprovante_url text, obs text,
  ressarcido boolean not null default false, forma text, data_ressarcimento date,
  created_at timestamptz default now());

create table if not exists filipetas (
  id uuid primary key default gen_random_uuid(),
  nome text, noite text, quantidade int not null default 1, valor numeric not null, forma text,
  pago boolean not null default false, confirmado boolean not null default false,
  data date not null default current_date,
  data_pagamento date, obs text, responsavel text, conta text,
  created_at timestamptz default now());

create table if not exists contas (
  id uuid primary key default gen_random_uuid(),
  nome text not null, contabiliza boolean not null default true,
  created_at timestamptz default now());
alter table contas add column if not exists contabiliza boolean not null default true;

-- Coluna "conta" nos módulos (para Pix/Cartão) e De/Para nas transferências
alter table lancamentos add column if not exists conta text;
alter table triduo_lancamentos add column if not exists conta text;
alter table filipetas add column if not exists conta text;
alter table reembolsos add column if not exists conta text;
alter table transferencias add column if not exists conta_de text;
alter table transferencias add column if not exists conta_para text;

-- Classificação "oficial" (para a contabilização real × oficial no relatório)
alter table lancamentos add column if not exists oficial boolean not null default true;
alter table reembolsos add column if not exists oficial boolean not null default true;

-- Segurança: só usuários logados acessam
alter table categorias enable row level security;
alter table lancamentos enable row level security;
alter table camisas_estoque enable row level security;
alter table camisas_vendas enable row level security;
alter table triduo_lancamentos enable row level security;
alter table transferencias enable row level security;
alter table reembolsos enable row level security;
alter table filipetas enable row level security;
alter table contas enable row level security;
create policy "logados" on categorias for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on contas for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on lancamentos for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on camisas_estoque for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on camisas_vendas for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on triduo_lancamentos for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on transferencias for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on reembolsos for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "logados" on filipetas for all using (auth.role()='authenticated') with check (auth.role()='authenticated');

-- Armazenamento dos comprovantes
insert into storage.buckets (id,name,public) values ('comprovantes','comprovantes',true) on conflict (id) do nothing;
create policy "comp_ler" on storage.objects for select using (bucket_id='comprovantes');
create policy "comp_gravar" on storage.objects for insert with check (bucket_id='comprovantes' and auth.role()='authenticated');
create policy "comp_apagar" on storage.objects for delete using (bucket_id='comprovantes' and auth.role()='authenticated');
```

Deve aparecer "Success. No rows returned".

## Passo 3 — Criar os usuários (login e senha)

1. No menu à esquerda, abra **Authentication** → aba **Users** → **Add user** → **Create new user**.
2. Digite o **e-mail** e a **senha** da pessoa e **marque a opção "Auto Confirm User"** (assim ela já entra sem precisar confirmar e-mail).
3. Repita para cada pessoa da equipe que vai usar o app.

> Dica: você pode usar e-mails simples só para login (ex.: `cozinha@triduo.com`). O importante é combinar a senha com a pessoa.

## Passo 4 — Pegar as duas chaves

1. Abra **Project Settings** (engrenagem) → **API** e copie:
   - **Project URL** — algo como `https://xxxxxxxx.supabase.co`
   - **anon public** — a chave longa que começa com `eyJ...`

> A chave **anon public** pode ficar no arquivo. **Nunca** use a chave **service_role** (essa é secreta).

## Passo 5 — Conectar o app

Abra **`controle-triduo-online.html`** (dois cliques). Na primeira vez:

1. Cole a **Project URL** e a **chave anon public** e clique em **Salvar e conectar**.
2. Faça **login** com um dos usuários criados no Passo 3.

Pronto! 🎉

---

## Deixar TODOS já conectados (recomendado)

Assim qualquer pessoa que abrir o arquivo só precisa fazer login (sem colar as chaves):

1. Abra `controle-triduo-online.html` num editor de texto (Bloco de Notas).
2. Perto do topo do `<script>`, ache:

   ```js
   const SUPABASE_URL = "";
   const SUPABASE_ANON_KEY = "";
   ```

3. Coloque seus valores entre as aspas e salve. Agora é só enviar o arquivo para a equipe pelo WhatsApp/e-mail.

---

## Como usar

**Categorias (aba Financeiro):** clique em **🏷️ Categorias** para cadastrar suas categorias (ex.: Cozinha, Bar, Doação, Rifa) e dizer se valem para receita, despesa ou ambos. Depois elas aparecem na lista suspensa do formulário.

**Comprovantes:** em qualquer lançamento ou venda, use **Comprovante (opcional)** para anexar a foto do Pix, recibo ou nota (imagem ou PDF, até 10 MB). Na tabela aparece um 📎 que abre o arquivo.

**Forma de pagamento:** escolha Dinheiro, Pix ou Cartão em cada lançamento e venda. Aparece na tabela e no CSV exportado.

**Camisas:** cadastre o estoque por tamanho; registre cada pedido/venda. Depois, em cada pedido, use o botão **⚙ Gerenciar** para: **dar baixa no pagamento aos poucos** (registra cada valor recebido, soma tudo e mostra quanto falta — ideal para fiado/parcelado), **confirmar a entrega com uma observação** (ex.: "entregue à Maria no domingo") e ver o histórico. O estoque desconta sozinho e avisa quando está acabando (laranja) ou esgotado (vermelho).

---

## Importar camisas de uma planilha 📥

Se você já tem os pedidos numa planilha (Excel/Google), dá pra trazer tudo de uma vez:

1. Organize a planilha com uma linha de cabeçalho. As colunas reconhecidas são: `comprador`, `tamanho`, `quantidade`, `valor_unit`, `valor_total`, `valor_pago`, `forma`, `entregue`, `data`, `entrega_obs`, `responsavel`. Use o arquivo **`modelo-importar-camisas.csv`** como base.
2. O importador é flexível: aceita nomes com acento (ex.: "Valor Unitário", "Observação"), datas em **dd/mm/aaaa**, valores com vírgula (`30,00`) e "sim/não" na coluna de entrega. Faltando `valor_total`, ele calcula por quantidade × valor unitário; se `valor_pago` estiver vazio e a situação disser "pago", considera quitado.
3. Salve/exporte a planilha como **CSV** (no Excel: Arquivo → Salvar como → CSV; no Google Sheets: Arquivo → Fazer download → .csv).
4. No app, aba **Camisas**, clique em **⬆ Importar CSV**, escolha o arquivo e confirme. Os pedidos são **adicionados** aos existentes (não apaga nada).

> Dica: importe primeiro um arquivo pequeno (2–3 linhas) para conferir se ficou certo antes de subir a lista toda. Se algo sair errado, dá para apagar os pedidos pelo 🗑 ou pelo Table Editor do Supabase.

Alternativa sem o app: o próprio Supabase importa CSV em **Table Editor → tabela `camisas_vendas` → Insert → Import data from CSV**. E, como é um Postgres com API REST automática, também dá para inserir via API/programaticamente se precisar.

## Filtros na tela de camisas

A lista de vendas tem filtros por **nome** do comprador, **tamanho**, **status** (pago/parcial/pendente), **entrega** (entregue/não) e **forma de pagamento** — podem ser combinados.

## Perguntas comuns

**É grátis mesmo?** Sim. O plano gratuito do Supabase é de sobra para um tríduo (500 MB de banco + 1 GB de arquivos).

**Preciso de internet?** Sim, a base é online e compartilhada.

**Como faço backup?** Botões **⬇ CSV** em cada aba baixam tudo em planilha (abre no Excel). Faça de vez em quando.

**Esqueci a senha de um usuário.** Em **Authentication → Users**, clique nos três pontos do usuário → **Reset password** (ou apague e crie de novo).

**Quero trocar a conexão.** No rodapé do app: **Reconfigurar conexão**. Para sair da conta, use o botão **Sair** no topo.
