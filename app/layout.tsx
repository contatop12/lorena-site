import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Lorena Carvalho Advocacia | Direito Aéreo - Especialista em Direitos do Passageiro',
  description: 'Voo cancelado ou atrasado? A Dra. Lorena Carvalho é especialista em Direito Aéreo com sede na Vila da Saúde (SP). Atendimento digital em todo o Brasil. Consulta gratuita.',
  keywords: 'direito aéreo, voo cancelado, atraso de voo, mala extraviada, overbooking, advogado direito do passageiro, Vila da Saúde SP',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-dralorena-carvalho-advogada-do-passageiro-dBdww7kIeTi6bViC8ww0IGLQcePjx6.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-dralorena-carvalho-advogada-do-passageiro-dBdww7kIeTi6bViC8ww0IGLQcePjx6.png',
  },
  openGraph: {
    title: 'Lorena Carvalho Advocacia | Direito Aéreo',
    description: 'Especialista em proteger os direitos do passageiro. Atendimento 100% digital.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* CAPI + Meta Pixel unificado */}
        <script
          src="https://track.lcoadv.com.br/trackerjs"
          data-endpoint="https://track.lcoadv.com.br/event"
          data-pixel-id="993975279878737"
          async
        />
        
        {/* Função trackLeadHighQuality para disparo de conversão Lead */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function trackLeadHighQuality(data) {
                if (!window.MetaTracker?.track) return;
                
                window.MetaTracker.track("Lead", {
                  custom_data: {
                    form_name: "contato_principal",
                    channel: "whatsapp",
                    page_path: location.pathname,
                    value: 1,
                    currency: "BRL"
                  },
                  user_data: {
                    em: data.email || undefined,
                    ph: data.phone || undefined,
                    fn: data.firstName || undefined,
                    ln: data.lastName || undefined,
                    ct: data.city || undefined,
                    st: data.state || undefined,
                    zp: data.zip || undefined,
                    country: "br",
                    external_id: data.crmId || undefined
                  }
                }).catch(function (e) {
                  console.warn("MetaTracker Lead error:", e);
                });
              }
            `
          }}
        />
        {/* End CAPI + Meta Pixel */}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Lorena Carvalho Advocacia",
              "description": "Especialista em Direito Aéreo e Direitos do Passageiro",
              "url": "https://lorenacarvalho.adv.br",
              "telephone": "+55 61 99632-7789",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "R. Pereira Estéfano, 114",
                "addressLocality": "Vila da Saúde",
                "addressRegion": "SP",
                "postalCode": "04144-070",
                "addressCountry": "BR"
              },
              "openingHours": "Mo-Fr 08:00-19:00",
              "areaServed": "BR",
              "priceRange": "$$"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Tive meu voo cancelado ou atrasado, quais são meus direitos imediatos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "De acordo com a Resolução 400 da ANAC e o CDC, você tem direito à assistência material gradativa e, em casos de atrasos superiores a 4 horas, reacomodação ou reembolso, além de possível indenização judicial."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quanto tempo tenho para processar uma companhia aérea?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O prazo é de 5 anos para voos nacionais (CDC) e 2 anos para voos internacionais (Convenções de Montreal/Varsóvia)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Mala extraviada dá direito a indenização por danos morais?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. O extravio de bagagem configura falha na prestação do serviço, dando direito a reparação por danos materiais e morais. É fundamental registrar o RIB ainda no aeroporto."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O que caracteriza o Overbooking e como proceder?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O overbooking ocorre quando a companhia impede o embarque por falta de assentos. A empresa deve pagar indenização imediata além de oferecer reacomodação ou reembolso."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Como funciona o atendimento jurídico online para passageiros?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A Dra. Lorena Carvalho realiza atendimento 100% digital para passageiros de todo o Brasil, desde o envio de documentos até a assinatura de contrato eletrônico."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
