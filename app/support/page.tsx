import Link from 'next/link'

export default function Support() {
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
        maxWidth: '600px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          fontWeight: 'bold'
        }}>
          Support
        </h1>
        
        <p style={{
          fontSize: '1.3rem',
          lineHeight: '1.6',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          For support, please contact us at{' '}
          <a 
            href="mailto:aprameyakannan@gmail.com"
            style={{
              color: '#ffd700',
              textDecoration: 'underline',
              fontWeight: '600'
            }}
          >
            aprameyakannan@gmail.com
          </a>
        </p>
        
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '1rem'
          }}>
            Need Help?
          </h2>
          <p style={{
            opacity: 0.8,
            lineHeight: '1.5'
          }}>
            We're here to help with any questions about Dopamax, 
            technical issues, or feature requests.
          </p>
        </div>
        
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          fontSize: '1rem'
        }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
