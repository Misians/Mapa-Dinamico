"use client";

import { useEffect, useRef, useState } from "react";
import mapaBrasil from "mapa-brasil";
import styles from "./page.module.css";

// Tipo para os dados do JSON
type Cidade = {
  municipio: string;
  codigo: string; // Código IBGE no formato string
  creas: boolean;
};

export default function Home() {
  const mapaRef = useRef<HTMLDivElement>(null);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  useEffect(() => {
    // Carregar JSON com as cidades
    fetch("/data/cidades_rn.json")
      .then((res) => res.json())
      .then((data: Cidade[]) => setCidades(data)) // Tipar os dados carregados
      .catch((err) => console.error("Erro ao carregar cidades:", err));
  }, []);

  useEffect(() => {
    if (mapaRef.current && cidades.length > 0) {
      // Mapear dados para a propriedade `unidadeData`
      const unidadeData = cidades.map((cidade) => ({
        codIbge: parseInt(cidade.codigo), // Converter para número
        fillColor: cidade.creas ? "#FF60BF" : "#FDD400", // Definir a cor com base no campo `creas`
        strokeColor: "#1F1A17", // Cor do contorno
        strokeWidth: 1, // Largura do contorno
      }));

      // Inicializar o mapa com `unidadeData`
      mapaBrasil(mapaRef.current, {
        unidadeData, // Personalizar cores
        defaultFillColor: "#FDD400", // Cor padrão
        defaultStrokeColor: "#1F1A17",
        regiao: "municipio",
        unidade: "rn",
        onClick: (data) => {
          // Callback ao clicar em um município
          console.log(`Município: ${data.nomUnidade} - Código IBGE: ${data.codIbge}`);
        },
      });
    }
  }, [cidades]);

  return (
    <div className={styles.page}>
      <div
        ref={mapaRef}
        style={{ height: "600px", width: "600px", margin: "auto" }}
      ></div>
    </div>
  );
}
