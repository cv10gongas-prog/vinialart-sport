import{n as e}from"./db-BJMVpC-a.js";var t={"pending-payment-verification":`A aguardar confirmação de pagamento`,"payment-confirmed":`Pagamento confirmado`,"in-production":`Em produção`,completed:`Concluído`,cancelled:`Cancelado`},n=e=>String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),r=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=n,r.readAsDataURL(e)});async function i(i){let a=await Promise.all(i.items.map(async t=>{let i=new Set;if(t.serviceDetails?.fileKey&&i.add(t.serviceDetails.fileKey),t.serviceDetails?.attachments)for(let e of t.serviceDetails.attachments)e.fileKey&&i.add(e.fileKey);if(t.customizerDesign)try{let e=JSON.parse(t.customizerDesign);for(let t of Object.values(e.surfaces??{}))for(let e of t.layers)e.fileKey&&i.add(e.fileKey),e.originalFileKey&&i.add(e.originalFileKey)}catch{}let a=await Promise.all([...i].map(async t=>{let i=await e(t);return i?`<a download="${n(i.filename)}" href="${n(await r(i.blob))}">📎 Descarregar: ${n(i.filename)}</a>`:`<span style="color:#888;">(Ficheiro de referência ${n(t)} indisponível)</span>`}));t.serviceDetails?.fileDataUrl&&a.push(`<a download="${n(t.serviceDetails.fileName)}" href="${n(t.serviceDetails.fileDataUrl)}">📎 Descarregar: ${n(t.serviceDetails.fileName)}</a>`);let o=t.mode??(t.customizerDesign?`design`:`ajuda`),s=t.customizerDesign?`<a download="configuracao.json" href="data:application/json;charset=utf-8,${encodeURIComponent(t.customizerDesign)}">⚙️ Configuração do design (JSON)</a>`:``,c=[t.serviceDetails?.itemOrServiceType,t.serviceDetails?.userName?`Nome: ${t.serviceDetails.userName}`:void 0,t.serviceDetails?.contact?`Contacto: ${t.serviceDetails.contact}`:t.serviceDetails?.userContact?`Contacto: ${t.serviceDetails.userContact}`:void 0,t.serviceDetails?.requestedText?`Texto a incluir: ${t.serviceDetails.requestedText}`:void 0,t.serviceDetails?.designNotes?`${o===`design`?`Nota`:`Ideia / Notas de design`}: ${t.serviceDetails.designNotes}`:void 0,t.serviceDetails?.description&&t.serviceDetails.description!==t.serviceDetails?.designNotes?`Descrição: ${t.serviceDetails.description}`:void 0,t.serviceDetails?.notes&&t.serviceDetails.notes!==t.serviceDetails?.designNotes&&t.serviceDetails.notes!==t.serviceDetails?.requestedText?`Notas: ${t.serviceDetails.notes}`:void 0].filter(Boolean);return`<section class="item-card">
        <h3>${n(t.productName)}</h3>
        <p class="item-meta">${t.quantity} unidade(s) · ${n(t.variant||`Tamanho padrão`)} · ${o===`design`?`Design carregado`:o===`servico`?`Pedido sob consulta`:`Ajuda VinilArt`}</p>
        ${t.previewDataUrl?`<div class="preview-box"><img src="${n(t.previewDataUrl)}" alt="Preview"></div>`:``}
        ${c.length?`<pre>${n(c.join(`
`))}</pre>`:``}
        <div class="files">${a.join(``)}${s}</div>
      </section>`})),o=``;if(i.payment.proofFile){let t=i.payment.proofFile,a=await e(t.fileKey),s=``;a?s=await r(a.blob):t.previewUrl&&(s=t.previewUrl),o=`
      <div class="proof-section">
        <h3>Comprovativo de Pagamento</h3>
        <p><strong>Ficheiro:</strong> ${n(t.fileName)} (${(t.fileSize/1024).toFixed(0)} KB)</p>
        ${t.previewUrl?`<div class="proof-preview"><img src="${n(t.previewUrl)}" alt="Comprovativo" style="max-width:300px;max-height:220px;border-radius:6px;border:1px solid #ccc;"></div>`:``}
        ${s?`<p><a class="proof-download" download="${n(t.fileName)}" href="${n(s)}">📥 Descarregar comprovativo original</a></p>`:``}
      </div>
    `}let s=t[i.status]||i.status,c=`<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pedido ${n(i.orderId)} · VinilArt Sport</title>
  <style>
    body { font: 15px/1.6 system-ui, -apple-system, sans-serif; max-width: 880px; margin: 30px auto; padding: 25px; color: #17202a; background: #fafafa; }
    .container { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    h1 { margin-top: 0; color: #0f172a; border-bottom: 4px solid #00bddd; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: baseline; }
    .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card h2 { margin: 0 0 10px; font-size: 16px; text-transform: uppercase; color: #334155; }
    .card p { margin: 4px 0; color: #475569; }
    .item-card { border-top: 1px solid #e2e8f0; padding: 20px 0; }
    .item-card h3 { margin: 0; color: #0f172a; font-size: 18px; }
    .item-meta { color: #64748b; font-size: 13px; margin: 4px 0 12px; }
    .preview-box img { max-width: 240px; max-height: 240px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; background: #0b0e14; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 13px; color: #334155; }
    .files a { display: inline-block; margin: 6px 12px 6px 0; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; text-decoration: none; color: #0284c7; font-weight: 500; font-size: 13px; }
    .files a:hover { background: #e0f2fe; }
    .proof-section { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-top: 20px; }
    .proof-section h3 { margin-top: 0; color: #065f46; font-size: 16px; }
    .proof-download { display: inline-block; background: #059669; color: #ffffff !important; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 8px; }
    footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      <span>VinilArt Sport · Pedido ${n(i.orderId)}</span>
      <span class="status-badge">${n(s)}</span>
    </h1>

    <div class="grid">
      <div class="card">
        <h2>Dados do Cliente</h2>
        <p><strong>Nome:</strong> ${n(i.customer.fullName)}</p>
        <p><strong>Email:</strong> ${n(i.customer.email)}</p>
        <p><strong>Telemóvel:</strong> ${n(i.customer.phone)}</p>
        <p><strong>Morada:</strong> ${n(i.customer.address)}</p>
        <p><strong>Código Postal / Localidade:</strong> ${n(i.customer.postalCode)} ${n(i.customer.city)}</p>
        ${i.customer.taxId?`<p><strong>NIF:</strong> ${n(i.customer.taxId)}</p>`:``}
      </div>

      <div class="card">
        <h2>Pagamento & Estado</h2>
        <p><strong>Método de Pagamento:</strong> ${n(i.payment.methodName)}</p>
        <p><strong>Estado:</strong> ${n(s)}</p>
        <p><strong>Data do Pedido:</strong> ${n(new Date(i.createdAt).toLocaleString(`pt-PT`))}</p>
        <p><strong>Total de Artigos:</strong> ${i.totalItems} unidade(s)</p>
      </div>
    </div>

    ${o}

    <h2 style="margin-top: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Artigos Encomendados</h2>
    ${a.join(``)}

    <footer>
      Documento gerado em ${n(new Date().toLocaleString(`pt-PT`))}. O pagamento deste pedido fica sujeito a validação pela VinilArt antes de avançar para produção.
    </footer>
  </div>
</body>
</html>`,l=URL.createObjectURL(new Blob([c],{type:`text/html;charset=utf-8`})),u=document.createElement(`a`);u.href=l,u.download=`pedido-${i.orderId.toLowerCase()}.html`,u.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)}async function a(e,t,n,r){return i({orderId:`VA-`+Date.now().toString(36).toUpperCase(),createdAt:Date.now(),customer:{fullName:t,email:n.includes(`@`)?n:``,phone:n.includes(`@`)?``:n,address:`Não indicada (Orçamento preliminar)`,postalCode:`---`,city:`---`},items:e,totalItems:e.reduce((e,t)=>e+t.quantity,0),payment:{method:`bank_transfer`,methodName:`Sob Orçamento`,proofFile:{fileKey:``,fileName:`Sem comprovativo preliminar`,fileSize:0,mimeType:`text/plain`,uploadedAt:Date.now()},status:`pending-payment-verification`,submittedAt:Date.now()},status:`pending-payment-verification`,privacyAccepted:!0,notes:r})}export{a as n,t as r,i as t};