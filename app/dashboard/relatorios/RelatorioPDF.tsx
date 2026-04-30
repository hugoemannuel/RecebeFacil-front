import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fontes para um look mais premium (opcional, usando as padrão por enquanto)
// Font.register({ family: 'Helvetica-Bold', fontWeight: 'bold' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#09090b',
  },
  date: {
    fontSize: 10,
    color: '#71717a',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 15,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 9,
    color: '#71717a',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181b',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColSmall: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
    color: '#3f3f46',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#a1a1aa',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  }
});

interface RelatorioPDFProps {
  summary: any;
  performance: any;
  customers: any[];
  forecast: any[];
  userName: string;
}

export const RelatorioPDF = ({ summary, performance, customers, forecast, userName }: RelatorioPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>RecebeFácil</Text>
          <Text style={{ fontSize: 10, color: '#10b981', fontWeight: 'bold' }}>RELATÓRIO DE INTELIGÊNCIA FINANCEIRA</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.date}>Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.date}>Responsável: {userName}</Text>
        </View>
      </View>

      {/* Sumário Executivo */}
      <Text style={styles.sectionTitle}>Indicadores de Performance</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TAXA DE RECUPERAÇÃO</Text>
          <Text style={styles.statValue}>{performance?.recoveryRate}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL RECUPERADO</Text>
          <Text style={styles.statValue}>R$ {performance?.recoveredAmount?.toLocaleString('pt-BR')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CHURN EVITADO</Text>
          <Text style={styles.statValue}>{performance?.avoidedChurn} Clientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TEMPO MÉDIO DE PAGAMENTO</Text>
          <Text style={styles.statValue}>{performance?.averageDaysToPay} Dias</Text>
        </View>
      </View>

      {/* Ranking de Inadimplência */}
      <Text style={styles.sectionTitle}>Fila de Inadimplência Crítica</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Cliente</Text></View>
          <View style={styles.tableColSmall}><Text style={styles.tableCell}>Faturas</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Valor Total Devido</Text></View>
        </View>
        {customers.map((c, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{c.name}</Text></View>
            <View style={styles.tableColSmall}><Text style={styles.tableCell}>{c.overdueCount}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>R$ {c.totalOverdueAmount.toLocaleString('pt-BR')}</Text></View>
          </View>
        ))}
      </View>

      {/* Projeção de Fluxo */}
      <Text style={styles.sectionTitle}>Projeção de Caixa (30 dias)</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableColSmall}><Text style={styles.tableCell}>Data</Text></View>
          <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCell}>Valor Estimado</Text></View>
        </View>
        {forecast.map((f, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableColSmall}><Text style={styles.tableCell}>{f.name}</Text></View>
            <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCell}>R$ {f.valor.toLocaleString('pt-BR')}</Text></View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Este documento é confidencial e destinado exclusivamente ao titular da conta RecebeFácil.</Text>
        <Text>© {new Date().getFullYear()} RecebeFácil - Inteligência em Cobranças.</Text>
      </View>
    </Page>
  </Document>
);
