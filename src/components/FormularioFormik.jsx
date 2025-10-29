import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

/* Esquema de validación con Yup */
const validationSchema = Yup.object({
  nombre: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),
  edad: Yup.number()
    .typeError("La edad debe ser un número")
    .integer("La edad debe ser un entero")
    .min(18, "Debes tener al menos 18 años")
    .required("La edad es obligatoria"),
});

function FormularioFormik() {
  /* URL del backend: por defecto usamos jsonplaceholder para pruebas.
     Cambiala por tu endpoint real, por ejemplo: process.env.REACT_APP_API_URL */
  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 20,
        maxWidth: 600,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Formulario con Formik + Yup</h2>

      <Formik
        initialValues={{ nombre: "", email: "", edad: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            // Envío real (axios). Cambiar API_URL por tu endpoint.
            const resp = await axios.post(API_URL, values, {
              headers: { "Content-Type": "application/json" },
            });

            // Mostrar respuesta (ejemplo)
            alert("Enviado con éxito ✅\n" + JSON.stringify(resp.data, null, 2));
            resetForm();
          } catch (err) {
            console.error("Error al enviar:", err);
            alert("Error al enviar el formulario. Revisá la consola.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ dirty, touched, isSubmitting, values, isValid }) => {
          /* efecto para beforeunload: alertar al salir si el formulario está 'dirty' */
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const handleBeforeUnload = (e) => {
              if (dirty) {
                e.preventDefault();
                e.returnValue = ""; // Para compatibilidad con navegadores
              }
            };
            window.addEventListener("beforeunload", handleBeforeUnload);
            return () => window.removeEventListener("beforeunload", handleBeforeUnload);
          }, [dirty]);

          return (
            <Form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label htmlFor="nombre">Nombre</label>
              <Field id="nombre" name="nombre" placeholder="Tu nombre" />
              <ErrorMessage name="nombre" component="p" style={{ color: "red", margin: 0 }} />

              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" placeholder="tu@email.com" />
              <ErrorMessage name="email" component="p" style={{ color: "red", margin: 0 }} />

              <label htmlFor="edad">Edad</label>
              <Field id="edad" name="edad" type="number" placeholder="Edad" />
              <ErrorMessage name="edad" component="p" style={{ color: "red", margin: 0 }} />

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: isSubmitting || !dirty || !isValid ? "#cccccc" : "#007bff",
                    color: "white",
                    cursor: isSubmitting || !dirty || !isValid ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // resetear campos: para resetear desde fuera del Formik se puede usar el render props API,
                    // aquí lo lógico sería pasar resetForm por props, pero para mantener todo en un archivo simple:
                    window.location.reload();
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #999",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Limpiar
                </button>
              </div>

              {/* Información de estado */}
              <div style={{ marginTop: 14, background: "#fafafa", padding: 10, borderRadius: 6 }}>
                {dirty ? <p>🟢 Has modificado el formulario</p> : <p>⚪ Aún sin cambios</p>}
                {Object.keys(touched).length > 0 && (
                  <p>✏️ Campos tocados: {Object.keys(touched).join(", ")}</p>
                )}
                <details style={{ fontSize: 13 }}>
                  <summary>Ver valores (debug)</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(values, null, 2)}</pre>
                </details>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default FormularioFormik;
