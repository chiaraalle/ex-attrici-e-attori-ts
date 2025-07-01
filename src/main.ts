import type { Actress } from "./types";

// Type guard per verificare se un oggetto è di tipo Actress
function isActress(dati: unknown): dati is Actress{ //is Actress mi deve ritornare un booleano che mi dice se è actress oppure no
  return(
    typeof dati === "object" && dati !== null &&
    "id" in dati && typeof dati.id === "number" && //proprietà id
    "name" in dati && typeof dati.name === "string" && //proprietà nome
    "birth_year" in dati && typeof dati.birth_year === "number" && //proprietà annoDiNascita
    "death_year" in dati && typeof dati.birth_year === "number" && //proprietà annoDiMorte
    "biography" in dati && typeof dati.biography === "string" && //proprietà biografia
    "image" in dati && typeof dati.image === "string" && //proprietà immagine
    "most_famous_movies" in dati && dati.most_famous_movies instanceof Array && //proprietà filmPiuFamosi
    dati.most_famous_movies.length === 3 && 
    dati.most_famous_movies.every(movie => typeof movie === "string") &&
    "awards" in dati && typeof dati.awards === "string" && //proprietà premi
    "nationality" in dati && typeof dati.nationality === "string" //proprietà nazionalità

  )
}

async function getActress(id: number): Promise<Actress | null>{
  try{
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await response.json();
    if(!isActress(dati)){
      throw new Error('Dati non validi');
    }
    return dati;
  } catch(error){
    if(error instanceof Error){
      console.error('Errore durante il recupero dei dati:', error)
    } else{
      console.error('Errore sconosciuto', error)
    }
    return null;
  }

}

async function getAllActresses(): Promise<Actress[]>{
  try{
    const response = await fetch('http://localhost:3333/actresses');
    const dati: unknown = await response.json();
    if(!(dati instanceof Array)){
      throw new Error('Formato dei dati non validi: non è un array');
    }
    const attriciTrovate: Actress[] = dati.filter(isActress);
    return attriciTrovate;
  } catch(error){
    if(error instanceof Error){
      console.error('Errore durante il recupero dei dati:', error)
    } else{
      console.error('Errore sconosciuto', error)
    }
    return [];
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]>{
  try{
    const promises= ids.map((id) => getActress(id));
    return await Promise.all(promises);
  } catch(error){
    if(error instanceof Error){
      console.error('Errore durante il recupero dei dati:', error)
    } else{
      console.error('Errore sconosciuto', error)
    }
    return [];
  }
}
