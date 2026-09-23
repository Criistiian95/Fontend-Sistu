import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./components/Home";
import StateTurns from "./components/StateTurns";
import TurnsInfo from "./components/TurnsInfo";
import { UserProvider } from "./components/UserContext";
import { saveSession, getToken } from "./api";
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  global.fetch = jest.fn();
});
afterEach(() => jest.restoreAllMocks());
const response = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
});
function login() {
  return render(
    <MemoryRouter>
      <UserProvider>
        <Login />
      </UserProvider>
    </MemoryRouter>,
  );
}
test("invalid login explains failure without storing a session", async () => {
  fetch.mockResolvedValue(
    response({ message: "Correo o contraseña incorrectos." }, false, 401),
  );
  login();
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "demo@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "test-only" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Correo o contraseña incorrectos.",
  );
  expect(getToken()).toBeNull();
});
test("empty login never sends credentials", async () => {
  login();
  fireEvent.click(screen.getByRole("button", { name: /Iniciar sesión/ }));
  expect(await screen.findByText("Ingresá tu correo.")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
test("agenda distinguishes failed load from an empty day and retries", async () => {
  fetch
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response([]));
  render(<StateTurns />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "No pudimos cargar la agenda",
  );
  expect(
    screen.queryByText("La agenda de hoy está libre"),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(
    await screen.findByText("La agenda de hoy está libre"),
  ).toBeInTheDocument();
});
test("cancellation updates UI only after successful server response", async () => {
  fetch
    .mockResolvedValueOnce(response({ message: "Sin conexión" }, false, 503))
    .mockResolvedValueOnce(response({ message: "Cancelado" }));
  const onCancel = jest.fn();
  render(
    <table>
      <tbody>
        <TurnsInfo
          shift={{
            id: 3,
            fecha: "2026-10-01T12:00:00Z",
            paciente_id: "12345678",
            doctor_id: "100",
          }}
          onCancel={onCancel}
        />
      </tbody>
    </table>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Cancelar turno" }));
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Sin conexión");
  expect(onCancel).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));
  await waitFor(() => expect(onCancel).toHaveBeenCalledWith(3));
});
test("remember option controls persistence without clearing unrelated storage", () => {
  localStorage.setItem("other-app", "keep");
  saveSession({ token: "temporary", id: 1 }, false);
  expect(sessionStorage.getItem("token")).toBe("temporary");
  expect(localStorage.getItem("token")).toBeNull();
  saveSession({ token: "persistent", id: 1 }, true);
  expect(localStorage.getItem("token")).toBe("persistent");
  expect(sessionStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("other-app")).toBe("keep");
});
