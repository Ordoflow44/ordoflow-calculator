import { Section, Text, Link, Hr } from '@react-email/components'

export function EmailFooter() {
  return (
    <Section style={{ marginTop: '40px' }}>
      <Hr style={{ borderColor: '#374151', margin: '20px 0' }} />
      <Text
        style={{
          color: '#9CA3AF',
          fontSize: '12px',
          lineHeight: '20px',
          textAlign: 'center' as const,
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} Ordoflow - Automatyzacja procesów biznesowych
      </Text>
      <Text
        style={{
          color: '#9CA3AF',
          fontSize: '12px',
          lineHeight: '20px',
          textAlign: 'center' as const,
          margin: '8px 0 0 0',
        }}
      >
        <Link href="https://ordoflow.com" style={{ color: '#7C3AED' }}>
          ordoflow.com
        </Link>
        {' | '}
        <Link href="https://ordoflow.com/kontakt" style={{ color: '#7C3AED' }}>
          Kontakt
        </Link>
        {' | '}
        <Link href="https://ordoflow.com/polityka-prywatnosci" style={{ color: '#7C3AED' }}>
          Polityka prywatności
        </Link>
      </Text>
    </Section>
  )
}
