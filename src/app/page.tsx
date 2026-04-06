import { redirect } from "next/navigation";

export default function RootPage() {
  //Redireciona o usuário para o /login assim que ele acessa a URL raiz (/)
  redirect("/login");
  
  return null;
}