import Link from "next/link";
import Image from "next/image";
export function Navbar() {
  return (
    <header className=" text-white shadow-md">
      <div className="bg-primary mx-auto px-12 py-4 flex justify-between items-center">
        <Link href="/pacientes" className="text-xl font-bold tracking-wider flex items-center gap-2">
          <Image 
            src="/images/SIMOS_logo_branca.svg" 
            alt="PET-Saúde" 
            width={300} 
            height={300} 
            className="h-10 w-auto object-contain" 
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/pacientes" className="hover:underline opacity-90 hover:opacity-100">
            Menu Principal
          </Link>
        </nav>
        
      </div>
      <div className="bg-white px-12">
        <h2 className="text-base text-primary">Sistema de Monitoramento de Sífilis em Sobral</h2>
      </div>
    </header>
  );
}