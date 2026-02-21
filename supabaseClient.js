// supabaseClient.js — Cantinho Brasileiro

const _SUPABASE_URL = 'https://osddyplmzqoethbqbthe.supabase.co';
const _SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZGR5cGxtenFvZXRoYnFidGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzQ5NzYsImV4cCI6MjA4NzIxMDk3Nn0.cj1hgzwg3KIcBQnmxCgsvfhvIcl3x6WsUxH3QdsOJWY';

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
