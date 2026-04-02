"use client";

import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf"; 
// CONEXIÓN MAESTRA AL ARCHIVO JSON
// @ts-ignore
import datosIniciales from './usuarios_db.json';


const sotoStyles = `
  .soto-main { background-color: #0f172a; min-height: 100vh; font-family: 'Inter', sans-serif; color: #f3f4f6; padding-bottom: 50px; }
  .soto-header { background: #000000; padding: 15px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #f97316; position: sticky; top: 0; z-index: 100; }
  .brand-container { font-weight: 900; font-size: 1.1rem; text-transform: uppercase; }
  .brand-white { color: #ffffff; }
  .brand-orange { color: #f97316; }

  .search-bar { width: 400px; height: 38px; border-radius: 8px; border: 1px solid #334155; padding: 0 15px; background: #1e293b; color: white; outline: none; transition: 0.3s; }
  .search-bar:focus { border-color: #f97316; box-shadow: 0 0 10px rgba(249, 115, 22, 0.3); }

  .cookie-gate { background: #1e293b; border: 1px solid #334155; padding: 40px; border-radius: 20px; max-width: 500px; margin: 100px auto; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-top: 5px solid #f97316; }

  .soto-card-form { background: #ffffff; border-radius: 16px; padding: 40px; max-width: 850px; margin: 30px auto; color: #0f172a; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .form-title { font-size: 1.4rem; font-weight: 900; text-align: center; margin-bottom: 30px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; letter-spacing: 1px; }
  .soto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .full { grid-column: span 2; }

  .soto-input { width: 100%; height: 48px; padding: 0 15px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.3s; box-sizing: border-box; color: #0f172a; font-weight: 500; }
  .soto-input:focus { border-color: #f97316; outline: none; background: #fffcf9; }

  .soto-btn-save { background: #f97316; color: white; font-weight: 900; height: 50px; border: none; border-radius: 10px; cursor: pointer; text-transform: uppercase; width: 260px; display: block; margin: 25px auto 0; transition: 0.3s; letter-spacing: 1px; font-size: 13px; }
  .soto-btn-save:hover { background: #ea580c; transform: translateY(-2px); }

  .records-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; max-width: 1200px; margin: 40px auto; padding: 20px; }
  .user-card { background: white; border-radius: 15px; padding: 25px; color: #0f172a; border: 1px solid #e2e8f0; position: relative; cursor: pointer; transition: 0.4s; overflow: hidden; }
  .user-card:hover { transform: translateY(-10px); border-color: #f97316; box-shadow: 0 20px 30px rgba(0,0,0,0.15); }
  
  .data-label { color: #f97316; font-weight: 800; font-size: 10px; text-transform: uppercase; margin-right: 5px; }
  .data-value { color: #1e293b; font-size: 13px; font-weight: 600; }
  .data-row { margin-bottom: 6px; display: flex; align-items: center; border-bottom: 1px solid #f8fafc; padding-bottom: 4px; }
  .view-link { color: #3b82f6; font-size: 11px; font-weight: 800; margin-top: 15px; display: block; text-transform: uppercase; text-align: center; background: #eff6ff; padding: 8px; border-radius: 8px; border: 1px dashed #3b82f6; }

  .card-actions { display: flex; gap: 10px; margin-top: 15px; border-top: 2px solid #f1f5f9; padding-top: 12px; }
  .btn-action { padding: 8px 15px; border-radius: 6px; font-size: 10px; font-weight: 900; border: none; cursor: pointer; text-transform: uppercase; flex: 1; transition: 0.2s; }
  .btn-edit { background: #f1f5f9; color: #334155; }
  .btn-delete { background: #fee2e2; color: #ef4444; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .modal-content { background: white; width: 500px; border-radius: 24px; padding: 40px; color: #0f172a; border-top: 8px solid #f97316; box-shadow: 0 40px 70px rgba(0,0,0,0.5); }
`;

export default function SotoSystemFinal() {
 // ----------------------------------------------------------------------------------
  // CUADRO 1: GESTIÓN DE MEMORIA REFORZADA (SOLUCIÓN F5)
  // ----------------------------------------------------------------------------------
  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [hasCookie, setHasCookie] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    nombre: '', cedula: '', fecha: '', genero: 'M', estadoCivil: 'Soltero(a)' 
  });
  const [visualizar, setVisualizar] = useState<any>(null);

  // 1. CARGA INICIAL (Solo se ejecuta una vez al abrir o dar F5)
  useEffect(() => {
    // Validar Cookie
    const cookie = document.cookie.split('; ').find(row => row.startsWith('session='));
    if (cookie) setHasCookie(true);
    
    // Cargar Datos: Prioridad Absoluta al LocalStorage
    const datosGuardados = localStorage.getItem('SOTO_SYSTEM_DB');
    if (datosGuardados && JSON.parse(datosGuardados).length > 0) {
      setClientes(JSON.parse(datosGuardados));
    } else {
      // Si el navegador está vacío, usamos tu archivo JSON
      setClientes(datosIniciales);
    }
  }, []);

  const activarSesion = () => {
    document.cookie = "session=SotoSystemB2B; max-age=3600; path=/";
    setHasCookie(true);
  };

  // ----------------------------------------------------------------------------------
  // CUADRO 2: LÓGICA DE PROCESAMIENTO CRUD (Sigue intacta y funcional)
  // ----------------------------------------------------------------------------------
  const handleRegister = () => {
    if (!formData.nombre || !formData.cedula) return;
    if (editandoId !== null) {
      const actualizados = clientes.map(c => c.id_clie === editandoId ? { ...formData, id_clie: editandoId } : c);
      setClientes(actualizados);
      setEditandoId(null);
    } else {
      const proximoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_clie)) + 1 : 1;
      setClientes([{ ...formData, id_clie: proximoId }, ...clientes]);
    }
    setFormData({ nombre: '', cedula: '', fecha: '', genero: 'M', estadoCivil: 'Soltero(a)' });
  };

  const eliminarCliente = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("¿Confirmas la eliminación permanente del registro?")) {
      const nuevaLista = clientes.filter(c => c.id_clie !== id);
      setClientes(nuevaLista);
      // Actualizamos inmediatamente el almacenamiento local
      localStorage.setItem('SOTO_SYSTEM_DB', JSON.stringify(nuevaLista));
    }
  };

  // ----------------------------------------------------------------------------------
  // CUADRO 3: MOTOR DE EXPORTACIÓN PDF (Estilo Soto System)
  // ----------------------------------------------------------------------------------
  const generarReportePDF = () => {
    if (!visualizar) return;
    const doc = new jsPDF();
    const hoy = new Date().toLocaleDateString();

    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setFont("helvetica", "bold"); doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); doc.text("SOTO SYSTEM", 20, 25);
    doc.setTextColor(249, 115, 22); doc.text("DIGITAL SOLUTION", 80, 25); 

    doc.setFontSize(9); doc.setTextColor(200, 200, 200);
    doc.text(`EMISIÓN: ${hoy}`, 165, 25);
    
    doc.setTextColor(255, 255, 255); doc.setFontSize(10);
    doc.text("SISTEMA B2B - REPORTE MAESTRO DE EXPEDIENTE", 20, 35);

    doc.setTextColor(15, 23, 42); doc.setFontSize(15); 
    doc.text("DATOS TÉCNICOS DEL EXPEDIENTE", 20, 70);
    doc.setDrawColor(249, 115, 22); doc.line(20, 75, 190, 75);

    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text(`ID REGISTRO: ${visualizar.id_clie}`, 20, 90);
    doc.text(`NOMBRE COMPLETO: ${visualizar.nombre.toUpperCase()}`, 20, 100);
    doc.text(`CÉDULA/ID: ${visualizar.cedula}`, 20, 110);
    doc.text(`GÉNERO: ${visualizar.genero === 'M' ? 'Masculino' : 'Femenino'}`, 20, 120);
    doc.text(`ESTADO CIVIL: ${visualizar.estadoCivil}`, 20, 130);
    doc.text(`FECHA NACIMIENTO: ${visualizar.fecha || 'N/A'}`, 20, 140);
    
    doc.save(`Expediente_${visualizar.cedula}_SotoSystem.pdf`);
  };

  // ----------------------------------------------------------------------------------
  // CUADRO 4: INTERFAZ Y MODAL (Sin cambios, perfecto estado)
  // ----------------------------------------------------------------------------------
  const filtrados = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || c.cedula?.includes(busqueda)
  );

  return (
    <main className="soto-main">
      <style dangerouslySetInnerHTML={{ __html: sotoStyles }} />
      <header className="soto-header">
        <div className="brand-container">
          <span className="brand-white">SOTO SYSTEM</span> <span className="brand-orange">DIGITAL SOLUTION</span>
        </div>
        {hasCookie && <input className="search-bar" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>}
      </header>

      {!hasCookie ? (
        <div className="cookie-gate">
          <h2 style={{fontWeight: 900, fontSize: '20px', color: '#ffffff', marginBottom: '10px'}}>ACCESO RESTRINGIDO</h2>
          <div style={{height: '2px', background: '#f97316', width: '50px', margin: '0 auto 20px'}}></div>
          <p style={{fontSize: '11px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px'}}>
            Este terminal requiere una cookie de sesión activa para visualizar la base de datos de <strong>Soto System</strong>. Por favor, valide sus credenciales.
          </p>
          <button className="soto-btn-save" onClick={activarSesion}>Activar Credenciales B2B</button>
        </div>
      ) : (
        <>
          <div className="soto-card-form">
            <h1 className="form-title">{editandoId ? "MODIFICAR REGISTRO" : "REGISTRO B2B DE CLIENTES"}</h1>
            <div className="soto-grid">
  {/* Nombre */}
  <input 
    placeholder="Nombre Completo" 
    className="soto-input" 
    title="Ingrese el nombre y apellido del cliente para el registro maestro."
    value={formData.nombre} 
    onChange={e => setFormData({...formData, nombre: e.target.value})} 
  />

  {/* Cédula */}
  <input 
    placeholder="Cédula / ID" 
    className="soto-input" 
    title="Ingrese el número de identificación fiscal o personal único."
    value={formData.cedula} 
    onChange={e => setFormData({...formData, cedula: e.target.value})} 
  />

  {/* Fecha */}
  <input 
    type="date" 
    className="soto-input" 
    title="Seleccione la fecha de nacimiento del cliente en el calendario."
    value={formData.fecha} 
    onChange={e => setFormData({...formData, fecha: e.target.value})} 
  />

  {/* Género */}
  <select 
    className="soto-input" 
    title="Seleccione el género para fines de segmentación de datos."
    value={formData.genero} 
    onChange={e => setFormData({...formData, genero: e.target.value})}
  >
    <option value="M">Masculino</option>
    <option value="F">Femenino</option>
  </select>

  {/* Estado Civil */}
  <select 
    className="soto-input full" 
    title="Indique el estado civil actual del cliente para su expediente."
    value={formData.estadoCivil} 
    onChange={e => setFormData({...formData, estadoCivil: e.target.value})}
  >
    <option value="Soltero(a)">Soltero(a)</option>
    <option value="Casado(a)">Casado(a)</option>
    <option value="Divorciado(a)">Divorciado(a)</option>
    <option value="Viudo(a)">Viudo(a)</option>
  </select>
</div>
            <button className="soto-btn-save" onClick={handleRegister}>{editandoId ? "Actualizar Datos" : "Registrar Cliente"}</button>
          </div>

          <div className="records-grid">
            {filtrados.map(c => (
              <div key={c.id_clie} className="user-card" onClick={() => setVisualizar(c)}>
                <h3 style={{fontWeight:900, fontSize:'18px', marginBottom:'15px'}}>{c.nombre}</h3>
                <div className="data-row"><span className="data-label">ID:</span> <span className="data-value">#{c.id_clie}</span></div>
                <div className="data-row"><span className="data-label">CÉDULA:</span> <span className="data-value">{c.cedula}</span></div>
                <div className="data-row"><span className="data-label">GÉNERO:</span> <span className="data-value">{c.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}</span></div>
                <span className="view-link">Leer expediente completo →</span>
                <div className="card-actions">
                  <button className="btn-action btn-edit" onClick={(e) => { e.stopPropagation(); setEditandoId(c.id_clie); setFormData({...c}); window.scrollTo({top:0, behavior:'smooth'}); }}>Editar</button>
                  <button className="btn-action btn-delete" onClick={(e) => eliminarCliente(e, c.id_clie)}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {visualizar && (
        <div className="modal-overlay" onClick={() => setVisualizar(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{textAlign:'center', fontWeight:900, fontSize:'22px', textTransform:'uppercase'}}>{visualizar.nombre}</h2>
            <p style={{textAlign:'center', color:'#f97316', fontWeight:800, fontSize:'10px', letterSpacing:'2px', marginBottom:'25px'}}>EXPEDIENTE MAESTRO</p>
            <div style={{background:'#f8fafc', padding:'25px', borderRadius:'15px', borderLeft: '5px solid #f97316'}}>
               <p style={{margin:'12px 0', fontSize:'13px'}}><strong>ID:</strong> <span style={{float:'right', color:'#f97316'}}>#{visualizar.id_clie}</span></p>
               <p style={{margin:'12px 0', fontSize:'13px', borderTop:'1px solid #e2e8f0', paddingTop:'8px'}}><strong>DOCUMENTO:</strong> <span style={{float:'right'}}>{visualizar.cedula}</span></p>
               <p style={{margin:'12px 0', fontSize:'13px', borderTop:'1px solid #e2e8f0', paddingTop:'8px'}}><strong>GÉNERO:</strong> <span style={{float:'right'}}>{visualizar.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}</span></p>
               <p style={{margin:'12px 0', fontSize:'13px', borderTop:'1px solid #e2e8f0', paddingTop:'8px'}}><strong>ESTADO:</strong> <span style={{float:'right'}}>{visualizar.estadoCivil}</span></p>
               <p style={{margin:'12px 0', fontSize:'13px', borderTop:'1px solid #e2e8f0', paddingTop:'8px'}}><strong>NACIMIENTO:</strong> <span style={{float:'right'}}>{visualizar.fecha || 'NO REGISTRADA'}</span></p>
            </div>
            <button className="soto-btn-save" style={{width: '100%', marginTop:'30px'}} onClick={generarReportePDF}>Descargar Reporte</button>
            <button className="soto-btn-save" style={{width: '100%', marginTop:'10px', background:'#f1f5f9', color:'#475569', border:'1px solid #e2e8f0'}} onClick={() => setVisualizar(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}
