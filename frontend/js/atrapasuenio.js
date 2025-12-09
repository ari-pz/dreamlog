// Frases oníricas que cambian cada 10 segundos
    const frases = [
      "“Cada hilo guarda un recuerdo invisible.”",
      "“Tu mente descansa, pero tu alma sigue viajando.”",
      "“Algunos sueños no quieren ser olvidados.”",
      "“Lo que tejés de noche, te protege de día.”",
      "“El tiempo se disuelve en tus visiones.”"
    ];

    let fraseIndex = 0;
    const quoteElement = document.getElementById("quote");

    setInterval(() => {
      fras