import HomePage from "../pages/LoginPage"
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main>
        <HomePage />
      </main>
    </div>
  );
}
