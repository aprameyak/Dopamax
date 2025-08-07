import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Dopamax Admin
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          Welcome to the admin portal for Dopamax - the productivity app that turns tasks into dopamine hits.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/support" style={{
            padding: '1rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Support
          </Link>
          
          <Link href="/privacy" style={{
            padding: '1rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Privacy Policy
          </Link>
        </div>
        
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}>
            About Dopamax
          </h2>
          <p style={{
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            Dopamax is a productivity app that turns task completion into a dopamine-boosting experience. 
            It's designed to make productivity addictive by gamifying the process of completing tasks.
          </p>
        </div>
      </div>
    </div>
  )
}
