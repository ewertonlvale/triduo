// ============================================================
// Configuração da conexão com o Supabase.
// Preencha uma vez e suba este arquivo para o GitHub.
// Ao atualizar o index.html, NÃO precisa mexer aqui de novo.
//
// Onde pegar: Supabase → Project Settings (engrenagem) → API
//   - Project URL           -> SUPABASE_URL
//   - Project API keys: anon/public -> SUPABASE_ANON_KEY
// Nunca use a chave "service_role" aqui.
// ============================================================
window.TRIDUO_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",

  // Lista padronizada de tamanhos (aparece como select no app).
  // Edite à vontade — a ordem aqui é a ordem que aparece.
  TAMANHOS: [
    "PP Baby Look", "P Baby Look", "M Baby Look", "G Baby Look", "GG Baby Look",
    "PP Normal", "P Normal", "M Normal", "G Normal", "GG Normal",
    "Infantil 6 anos", "Infantil 8 anos", "Infantil 12 anos"
  ]
};
