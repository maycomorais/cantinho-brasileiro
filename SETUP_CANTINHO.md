# 🇧🇷 Cantinho Brasileiro — Setup Guide

## 1. Criar novo projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Nome: `cantinho-brasileiro`
3. Após criar, vá em **Settings → API** e copie:
   - **Project URL** 
   - **anon/public key**

## 2. Preencher supabaseClient.js
Abra o arquivo e substitua:
```js
const _SUPABASE_URL = 'COLE_AQUI_A_URL_DO_PROJETO';
const _SUPABASE_KEY = 'COLE_AQUI_A_ANON_KEY';
```

## 3. Executar as migrations no SQL Editor do Supabase
Execute na ordem:
1. O schema completo (tabelas: pedidos, produtos, categorias, etc.)  
2. `migration_categorias_horario.sql` → colunas hora_inicio/hora_fim
3. `migration_horario_semanal.sql` → coluna horarios_semanais

## 4. Subir para o GitHub
```bash
git clone https://github.com/maycomorais/cantinho-brasileiro.git
cd cantinho-brasileiro
# copiar todos os arquivos para dentro da pasta
git add .
git commit -m "🚀 Cantinho Brasileiro — versão inicial"
git push
```

## 5. CNAME
O arquivo CNAME está com `cantinhobrasileiro.com.br`.  
Altere se o domínio for diferente, ou delete o arquivo para usar o GitHub Pages padrão.

## Cores do tema
- **Primary:** `#1a7a2e` (verde escuro do logo)
- **Logo URL:** `https://media.bio.site/sites/79CC2018-24E6-48C4-A856-4C1E36908B60/AWwTtFWnmuqVysXARE2MRX.png`
- **Telefone:** +595 982 808985
