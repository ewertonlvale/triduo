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
  SUPABASE_URL: "https://brvjhwyswkwfxxoqebwj.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_TegRlRpIxcyt_BjuUfvsaQ_8sbFLMXG",

  // Lista padronizada de tamanhos (aparece como select no app).
  // Edite à vontade — a ordem aqui é a ordem que aparece.
  TAMANHOS: [
    "PP Baby Look", "P Baby Look", "M Baby Look", "G Baby Look", "GG Baby Look",
    "PP Normal", "P Normal", "M Normal", "G Normal", "GG Normal",
    "Infantil 6 anos", "Infantil 8 anos", "Infantil 12 anos"
  ],

  // Noites do tríduo (a ordem aqui é a ordem das colunas). Renomeie à vontade.
  NOITES: [ "Missa de Rua", "1ª Noite", "2ª Noite", "3ª Noite", "4ª Noite"],

  // Grupos de receita do tríduo.
  GRUPOS_TRIDUO: ["Comidas e Bebidas", "Bazar", "Leilão", "Filipetas", "Oferta"]
};
