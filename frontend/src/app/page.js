import HomePage from "../pages/LoginPage"
import PatientView from "../pages/PatientPage";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main>
        <HomePage />
      </main>
    </div>
  );
}
