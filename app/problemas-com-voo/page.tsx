"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plane,
  Clock,
  Briefcase,
  Users,
  Phone,
  MapPin,
  MessageCircle,
  Star,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react"

// Ícone do WhatsApp
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// Ícone de avião para o marquee
function FlightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <path fill="#e3c26d" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1l3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  )
}

// Componente StickyMarquee
function StickyMarquee({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#C5A059]/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
    >
      <div className="overflow-hidden py-2.5 group motion-reduce:overflow-auto">
        <div className="flex animate-marquee-fast group-hover:[animation-play-state:paused] motion-reduce:animate-none whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center mx-4 text-[#D4AF37] font-serif text-sm md:text-base tracking-wide">
              Sem custos iniciais. Você só paga se ganhar o processo.
              <FlightIcon className="w-5 h-5 mx-4" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Botão estilizado com ícone WhatsApp
function AnimatedButton({
  children,
  onClick,
  className = ""
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-3 bg-[#C5A059] hover:bg-[#D4B87A] text-[#1A1A1A] font-bold text-sm md:text-base px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}
    >
      <WhatsAppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      <span>{children}</span>
    </button>
  )
}

export default function LandingPage() {
  const WEBHOOK_URL = "https://validacao.lcoadv.com.br/webhook/lead"
  const [formData, setFormData] = useState({ nome: "", whatsapp: "" })
  const [authorizationAccepted, setAuthorizationAccepted] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMarquee, setShowMarquee] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMarquee(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 11)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const sendLeadToWebhook = async (payload: Record<string, string>) => {
    const body = new URLSearchParams(payload)

    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Extrair primeiro e último nome
    const nameParts = formData.nome.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""
    
    // Limpar telefone para apenas números
    const phoneClean = formData.whatsapp.replace(/\D/g, "")

    // Disparar tracking de Lead no sucesso do formulário
    if (typeof window !== "undefined" && (window as typeof window & { trackLeadHighQuality?: (data: Record<string, string>) => void }).trackLeadHighQuality) {
      (window as typeof window & { trackLeadHighQuality: (data: Record<string, string>) => void }).trackLeadHighQuality({
        phone: phoneClean,
        firstName: firstName,
        lastName: lastName,
      })
    }

    const message = encodeURIComponent(
      `Olá! Vim pelo site e preciso de ajuda com um problema de voo.\n\nNome: ${formData.nome}\nWhatsApp: ${formData.whatsapp}`
    )
    window.open(`https://wa.me/5561996327789?text=${message}`, "_blank")

    void sendLeadToWebhook({
      nome: formData.nome.trim(),
      whatsapp: phoneClean,
      firstName,
      lastName,
      autorizacao: authorizationAccepted ? "sim" : "nao",
      origem: "site",
      pagina: typeof window !== "undefined" ? window.location.pathname : "/",
      timestamp: new Date().toISOString(),
    }).catch(() => {
      // Não interrompe o fluxo do usuário se o webhook falhar.
    })

    setTimeout(() => {
      setIsSubmitting(false)
      setIsModalOpen(false)
      setFormData({ nome: "", whatsapp: "" })
      setAuthorizationAccepted(true)
    }, 1000)
  }

  const openModal = () => {
    setAuthorizationAccepted(true)
    setIsModalOpen(true)
  }

  const googleReviews = [
    {
      name: "Maria Silva",
      rating: 5,
      text: "Excelente atendimento! Tive meu voo cancelado e a Dra. Lorena conseguiu minha indenização rapidamente. Recomendo demais!",
      date: "2 semanas atrás"
    },
    {
      name: "João Pedro",
      rating: 5,
      text: "Profissional excepcional. Minha mala foi extraviada e ela resolveu tudo de forma ágil e transparente. Muito obrigado!",
      date: "1 mês atrás"
    },
    {
      name: "Ana Carolina",
      rating: 5,
      text: "Sofri overbooking e não sabia o que fazer. A Dra. Lorena me orientou e conseguiu uma ótima indenização. Super indico!",
      date: "3 semanas atrás"
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky Marquee */}
      <StickyMarquee isVisible={showMarquee} />

      {/* Modal de Formulário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-[#C5A059]/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#1A1A1A] text-center text-balance">
              Receba um contato agora
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[#666666] text-center mb-6 text-balance">
              Preencha seus dados e receba um contato imediatamente no seu WhatsApp
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-modal" className="text-[#1A1A1A] font-medium">
                  Nome
                </Label>
                <Input
                  id="nome-modal"
                  type="text"
                  required
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="border-gray-300 focus:border-[#C5A059] focus:ring-[#C5A059]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp-modal" className="text-[#1A1A1A] font-medium">
                  WhatsApp (com DDD)
                </Label>
                <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-[#C5A059] focus-within:ring-1 focus-within:ring-[#C5A059]">
                  <span className="inline-flex items-center bg-[#FAF5E6] px-3 text-sm font-semibold text-[#C5A059] border-r border-[#E7D7B0]">
                    +55
                  </span>
                  <Input
                    id="whatsapp-modal"
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })
                    }
                    className="border-0 rounded-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <label
                htmlFor="authorization-modal"
                className="flex items-start gap-3 rounded-lg bg-[#FAF5E6] px-3 py-3 text-sm text-[#4A4A4A]"
              >
                <input
                  id="authorization-modal"
                  type="checkbox"
                  required
                  checked={authorizationAccepted}
                  onChange={(e) => setAuthorizationAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#C5A059]"
                />
                <span>Autorizo o uso dos meus dados para contato, conforme os termos de privacidade.</span>
              </label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#C5A059]/40 bg-white px-4 py-3 font-semibold text-[#4A4A4A] transition-colors hover:bg-[#FAF5E6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#C5A059] px-4 py-3 font-semibold text-[#1A1A1A] transition-colors hover:bg-[#D4B87A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Enviando..." : "Enviar contato"}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section - 90vh mobile, 100vh desktop */}
      <section ref={heroRef} className="relative h-[90vh] md:h-screen min-h-[600px]">
        {/* Imagem Desktop */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/problemas-com-voo-advogada-do-passageiro%20v2_1-itbs3t8HhKv6InUoqv4MBRQFwUhwti.webp"
            alt="Dra. Lorena Carvalho - Advogada Especialista em Direito do Passageiro Aéreo"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Imagem Mobile */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/problemas-com-voo-advogada-do-passageiro%20v3%20mobile_1-fhlKyl1hM0OQWhO6QRoemEpqYvu2Q5.webp"
            alt="Dra. Lorena Carvalho - Advogada Especialista em Direito do Passageiro Aéreo"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Overlay escurecido na parte inferior - estendido para melhor contraste da logo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 via-30% to-transparent" />

        {/* Conteúdo - centralizado no mobile, esquerda no desktop */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="container mx-auto px-4 pb-16 md:pb-0 md:px-12 lg:px-20">
            {/* Grid de 2 colunas no desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Coluna esquerda com conteúdo */}
              <div className="text-center md:text-left">
                {/* Logo dourada acima do título */}
                <Image
                  src="/logo-lorena-carvalho.svg"
                  alt="Lorena Carvalho Advocacia"
                  width={220}
                  height={55}
                  className="h-12 md:h-14 w-auto mx-auto md:mx-0 mb-6"
                />

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 text-balance">
                  Problemas com seu voo ou bagagem?
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl text-[#C5A059] font-medium mb-6 md:mb-8 text-balance">
                  Você pode ser indenizado
                </h2>

                <div className="flex justify-center md:justify-start">
                  <AnimatedButton onClick={openModal} className="shadow-2xl">
                    Falar com especialista sem custo
                  </AnimatedButton>
                </div>

                {/* Ícones de serviços - quebra linha no mobile, linha única no desktop */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-3 md:gap-5 mt-6">
                  <div className="flex items-center gap-1">
                    <Image 
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atraso-de-voo-zhJupV2lkZlyydt4Q1cmOP44wl8e4Y.png" 
                      alt="Atraso de voo" 
                      width={24} 
                      height={24} 
                      className="w-9 h-9 md:w-6 md:h-6"
                    />
                    <span className="text-white/90 text-xs md:text-xs">Atraso de voo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image 
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voo-cancelado-kxCXMQDpmUGPGv2483yPBmAhQ8J9OT.png" 
                      alt="Voo cancelado" 
                      width={24} 
                      height={24} 
                      className="w-9 h-9 md:w-6 md:h-6"
                    />
                    <span className="text-white/90 text-xs md:text-xs">Voo cancelado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image 
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/overbooking-eLKiZj7EJUyKSBjnyYfte6nBAsX2Ed.png" 
                      alt="Overbooking" 
                      width={24} 
                      height={24} 
                      className="w-9 h-9 md:w-6 md:h-6"
                    />
                    <span className="text-white/90 text-xs md:text-xs">Overbooking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image 
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mala-extraviada-K44vMFjInx5IVlWgUfVS1tZzJKocOn.png" 
                      alt="Mala extraviada" 
                      width={24} 
                      height={24} 
                      className="w-9 h-9 md:w-6 md:h-6"
                    />
                    <span className="text-white/90 text-xs md:text-xs">Mala extraviada</span>
                  </div>
                </div>
              </div>

              {/* Coluna direita vazia (apenas no desktop) */}
              <div className="hidden md:block" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Serviços */}
      <section className="py-16 md:py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-white mb-4 text-balance">
            Como Podemos <span className="text-[#C5A059]">Ajudar Você</span>
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto text-balance">
            Especializados em defender os direitos de passageiros prejudicados por companhias aéreas
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Plane,
                title: "Voo Cancelado",
                description:
                  "Teve seu voo cancelado sem aviso prévio? Você pode ter direito a indenização e assistência material.",
              },
              {
                icon: Clock,
                title: "Atraso de Voo (+4h)",
                description:
                  "Atrasos superiores a 4 horas podem gerar direito a compensação financeira e reembolso.",
              },
              {
                icon: Briefcase,
                title: "Mala Extraviada",
                description:
                  "Bagagem perdida ou danificada? Busque indenização por seus pertences e transtornos causados.",
              },
              {
                icon: Users,
                title: "Overbooking",
                description:
                  "Impedido de embarcar por excesso de passageiros? A companhia deve compensá-lo adequadamente.",
              },
            ].map((service, index) => (
              <Card
                key={index}
                onClick={openModal}
                className="bg-[#2D2D2D] border-[#C5A059]/30 hover:border-[#C5A059] transition-all group cursor-pointer"
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C5A059]/10 flex items-center justify-center group-hover:bg-[#C5A059]/20 transition-colors">
                    <service.icon className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2 text-balance">{service.title}</h3>
                  <p className="text-white/70 text-sm text-balance">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <AnimatedButton onClick={openModal}>
              Quero minha indenização
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Avaliações Google - Agora com fundo branco */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-4 text-balance">
              Avaliações no <span className="text-[#C5A059]">Google</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>
              <span className="text-[#1A1A1A] text-2xl font-bold">5.0</span>
            </div>
            <p className="text-[#666666]">72 avaliações</p>
            <a
              href="https://g.page/r/CeaAcAIin6B5EAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#D4B87A] text-sm mt-2 transition-colors"
            >
              Ver todas as avaliações
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {googleReviews.map((review, index) => (
              <Card key={index} className="bg-[#F5F5F5] border-[#C5A059]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  <p className="text-[#666666] text-sm mb-4 leading-relaxed text-pretty">
                    {'"'}{review.text}{'"'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A] font-medium text-sm">{review.name}</span>
                    <span className="text-[#999999] text-xs">{review.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <AnimatedButton onClick={openModal}>
              Buscar minha indenização
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Sobre a Especialista */}
      <section className="py-16 md:py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#C5A059]/20 rounded-lg blur-xl" />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lorena-carvalho-advogada-direito-do-passageiro-mUZcPl9rFS8YCuZdpHp003ybqbZ0dM.webp"
                  alt="Dra. Lorena Carvalho - Advogada Especialista em Direito Aéreo"
                  width={500}
                  height={700}
                  className="relative rounded-lg shadow-2xl object-cover w-full"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6 text-balance">
                  Conheça a <span className="text-[#C5A059]">Dra. Lorena Carvalho</span>
                </h2>
                <p className="text-[#666666] text-base leading-relaxed mb-4 text-pretty">
                  A <strong className="text-[#1A1A1A]">Dra. Lorena Carvalho</strong> é advogada <strong className="text-[#1A1A1A]">especialista em Direito do Passageiro Aéreo</strong>, dedicada a proteger os direitos de quem viaja pelo Brasil e pelo mundo. Sua base acadêmica vem da <strong className="text-[#1A1A1A]">Universidade Tiradentes (UNIT)</strong>, uma das maiores referências em ensino jurídico no país e destaque nos rankings do MEC e RUF. Para consolidar sua atuação internacional, especializou-se com uma <strong className="text-[#1A1A1A]">pós-graduação na Universidade de Coimbra, em Portugal</strong>, com foco em Direito do Consumidor e Contratos.
                </p>
                <p className="text-[#666666] text-base leading-relaxed mb-4 text-pretty">
                  Com um histórico de grande êxito em processos envolvendo <strong className="text-[#1A1A1A]">voos nacionais e internacionais</strong>, a Dra. Lorena domina as normas da ANAC e as convenções que regem a aviação global. Ela atua com autoridade em casos de <strong className="text-[#1A1A1A]">atrasos, cancelamentos, overbooking, extravio ou dano de bagagem</strong>, além de problemas com <strong className="text-[#1A1A1A]">reembolsos</strong> e <strong className="text-[#1A1A1A]">taxas abusivas</strong>.
                </p>
                <p className="text-[#666666] text-base leading-relaxed mb-4 text-pretty">
                  O escritório une a tradição de uma formação de elite à agilidade do mundo digital. Além do <strong className="text-[#1A1A1A]">atendimento presencial na Vila da Saúde, em São Paulo</strong>, a Dra. Lorena realiza <strong className="text-[#1A1A1A]">atendimento on-line para passageiros em todo o Brasil e no exterior</strong>, garantindo suporte jurídico especializado onde quer que o cliente esteja.
                </p>
                <p className="text-[#666666] text-base leading-relaxed mb-4 text-pretty">
                  Se você teve seus direitos violados em uma viagem aérea, conte com a expertise e o profissionalismo da Dra. Lorena Carvalho para buscar a reparação que você merece.
                </p>
                <p className="text-[#C5A059] text-sm font-semibold mb-8">
                  <strong>OAB/SP 494.082 | OAB/DF 53.431 | OAB/RJ 269.590 | OAB/PA 39.502</strong>
                </p>
                <AnimatedButton onClick={openModal}>
                  Entrar em contato
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Agora com fundo escuro */}
      <section className="py-16 md:py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-white mb-4 text-balance">
            Perguntas <span className="text-[#C5A059]">Frequentes</span>
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto text-balance">
            Tire suas principais dúvidas sobre direitos do passageiro
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-[#C5A059]/30 rounded-lg px-4 bg-[#2D2D2D]">
                <AccordionTrigger className="text-left font-medium text-white hover:text-[#C5A059] text-balance">
                  Tive meu voo cancelado ou atrasado, quais são meus direitos imediatos?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-pretty">
                  De acordo com a Resolução 400 da ANAC e o Código de Defesa do Consumidor, você tem direito à assistência material gradativa: comunicação após 1 hora, alimentação após 2 horas e hospedagem/transporte após 4 horas. Se o atraso exceder 4 horas ou o voo for cancelado, você tem direito a reacomodação, reembolso integral ou execução do serviço por outro meio, além de possível indenização por danos morais dependendo do caso. A equipe da Dra. Lorena Carvalho avalia seu caso em minutos via WhatsApp.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-[#C5A059]/30 rounded-lg px-4 bg-[#2D2D2D]">
                <AccordionTrigger className="text-left font-medium text-white hover:text-[#C5A059] text-balance">
                  Quanto tempo tenho para processar uma companhia aérea por problemas no voo?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-pretty">
                  Para voos nacionais, o prazo prescricional para buscar indenização é de 5 anos, conforme o Código de Defesa do Consumidor. Para voos internacionais, as Convenções de Varsóvia e Montreal estabelecem um prazo de 2 anos. Recomendamos agir o quanto antes para preservar provas como bilhetes e comprovantes de gastos extras.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-[#C5A059]/30 rounded-lg px-4 bg-[#2D2D2D]">
                <AccordionTrigger className="text-left font-medium text-white hover:text-[#C5A059] text-balance">
                  Mala extraviada dá direito a indenização por danos morais?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-pretty">
                  Sim. O extravio de bagagem configura falha na prestação do serviço. Se a mala não for entregue imediatamente (extravio temporário) ou for perdida definitivamente, o passageiro tem direito a reparação por danos materiais (gastos com itens de primeira necessidade) e danos morais pelo transtorno causado. É fundamental registrar o RIB (Relatório de Irregularidade de Bagagem) ainda no aeroporto.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border border-[#C5A059]/30 rounded-lg px-4 bg-[#2D2D2D]">
                <AccordionTrigger className="text-left font-medium text-white hover:text-[#C5A059] text-balance">
                  O que caracteriza o Overbooking e como proceder?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-pretty">
                  O overbooking (ou preterição de embarque) ocorre quando a companhia aérea impede o passageiro de embarcar por falta de assentos, mesmo com a passagem confirmada. Nessas situações, a empresa deve pagar uma indenização imediata (DES - Direito Especial de Saque) além de oferecer as opções de reacomodação ou reembolso. Caso o auxílio não seja satisfatório, cabe ação judicial para reparação de danos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border border-[#C5A059]/30 rounded-lg px-4 bg-[#2D2D2D]">
                <AccordionTrigger className="text-left font-medium text-white hover:text-[#C5A059] text-balance">
                  Como funciona o atendimento jurídico online para passageiros?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-pretty">
                  A advocacia moderna permite que o passageiro de qualquer lugar do Brasil — de Manaus a Porto Alegre — receba suporte jurídico especializado. A Dra. Lorena Carvalho realiza o atendimento 100% digital, desde o envio de documentos até a assinatura de contrato eletrônico, garantindo agilidade e transparência sem que você precise sair de casa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex justify-center mt-10">
            <AnimatedButton onClick={openModal}>
              Falar com especialista
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white border-t border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:pr-6 lg:border-r lg:border-[#D4AF37]/20">
                <Image
                  src="/logo-lorena-carvalho.svg"
                  alt="Lorena Carvalho Advocacia"
                  width={180}
                  height={45}
                  className="h-12 w-auto mb-4"
                />
                <p className="text-white/80 text-sm leading-relaxed text-pretty">
                  Soluções completas em defesa do passageiro aéreo para você viajar com segurança jurídica.
                </p>
              </div>

              <nav aria-label="Links rápidos" className="lg:px-6 lg:border-r lg:border-[#D4AF37]/20">
                <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Links Rápidos</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Voo Cancelado</a></li>
                  <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Atraso de Voo</a></li>
                  <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Mala Extraviada</a></li>
                  <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Overbooking</a></li>
                  <li><a href="/" className="hover:text-[#D4AF37] transition-colors">Sobre nós</a></li>
                </ul>
              </nav>

              <address className="not-italic lg:px-6 lg:border-r lg:border-[#D4AF37]/20">
                <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Contato</h4>
                <div className="space-y-3 text-sm text-white/70">
                  <a
                    href="https://www.google.com/maps/place/Lorena+Carvalho+Advocacia/@-23.618111,-46.6405399,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5b94cf4fb1a1:0x79a09f22027080e6!8m2!3d-23.618111!4d-46.637965!16s%2Fg%2F11wjp87bvl?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 hover:text-[#D4AF37] transition-colors"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>R. Pereira Estéfano, 114 - Vila da Saúde, São Paulo - SP, 04144-070</span>
                  </a>
                  <a href="tel:+5561996327789" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>(61) 99632-7789</span>
                  </a>
                  <a href="https://wa.me/5561996327789" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>(61) 99632-7789 (WhatsApp)</span>
                  </a>
                </div>
              </address>

              <div className="lg:pl-6">
                <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Horário de funcionamento</h4>
                <div className="text-sm text-white/70 space-y-2">
                  <p className="flex justify-between gap-4"><span>Segunda a Sexta</span><span>08:00-19:00</span></p>
                  <p className="flex justify-between gap-4"><span>Sábado e Domingo</span><span>Fechado</span></p>
                  <p className="pt-2 text-[#D4AF37] font-medium">Suporte emergencial disponível</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#D4AF37]/20 pt-6">
              <div className="rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-xl">
                <iframe
                  title="Mapa do escritório"
                  src="https://www.google.com/maps?q=R.+Pereira+Est%C3%A9fano,+114,+Vila+da+Sa%C3%BAde,+S%C3%A3o+Paulo+-+SP,+04144-070&output=embed"
                  className="w-full h-64 md:h-72"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-3">
                <a
                  href="https://www.google.com/maps/place/Lorena+Carvalho+Advocacia/@-23.618111,-46.6405399,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5b94cf4fb1a1:0x79a09f22027080e6!8m2!3d-23.618111!4d-46.637965!16s%2Fg%2F11wjp87bvl?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
                >
                  Abrir no Maps
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-[#D4AF37]/20 pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/advogadalorenacarvalho/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Lorena Carvalho"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/advogadalorenacarvalho/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de Lorena Carvalho"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-sm text-white/50">
                  © 2026 Lorena Carvalho Advocacia. Todos os direitos reservados.
                </p>
              </div>
              <p className="mt-4 text-center text-xs text-white/40">
                Desenvolvido por{" "}
                <a
                  href="https://p12digital.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[#D4AF37] transition-colors"
                >
                  P12 Digital
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante WhatsApp */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </main>
  )
}
