// supabaseClient.js — Cantinho Brasileiro

// ⚠️  SUBSTITUA pelas credenciais do seu novo projeto Supabase
// Acesse: supabase.com → seu projeto → Settings → API
const _SUPABASE_URL = 'COLE_AQUI_A_URL_DO_PROJETO';
const _SUPABASE_KEY = 'COLE_AQUI_A_ANON_KEY';

if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    console.error("ERRO CRÍTICO: A biblioteca do Supabase não carregou. Verifique o HTML.");
    alert("Erro de conexão. Por favor, recarregue a página.");
} else {
    window.supa = window.supabase.createClient(_SUPABASE_URL, _SUPABASE_KEY);
    console.log("Cantinho Brasileiro — Banco iniciado com sucesso");
}

async function checkUser() {
    const { data: { session } } = await window.supa.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
}
