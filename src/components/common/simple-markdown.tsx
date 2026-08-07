import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type SimpleMarkdownProps = {
  content: string;
};

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={`${keyPrefix}-${index}`} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={`${keyPrefix}-${index}`}>{part}</Text>;
  });
}

export function SimpleMarkdown({ content }: SimpleMarkdownProps) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let tableRows: string[][] = [];
  let listItems: string[] = [];

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const rows = tableRows;
    tableRows = [];
    blocks.push(
      <View key={key} style={styles.table}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && styles.tableRowFirst]}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={styles.tableCell}>
                {renderInline(cell, `${key}-${rowIndex}-${cellIndex}`)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    const items = listItems;
    listItems = [];
    blocks.push(
      <View key={key} style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.listRow}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{renderInline(item, `${key}-${index}`)}</Text>
          </View>
        ))}
      </View>
    );
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const key = `line-${index}`;

    const isTableRow = /^\|.*\|$/.test(line);
    if (isTableRow) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim());
      const isSeparatorRow = cells.every((cell) => /^:?-+:?$/.test(cell));
      if (!isSeparatorRow) {
        tableRows.push(cells);
      }
      return;
    }
    flushTable(`table-${key}`);

    const isListItem = /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line);
    if (isListItem) {
      listItems.push(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
      return;
    }
    flushList(`list-${key}`);

    if (line === '' || line === '---') {
      if (line === '---') {
        blocks.push(<View key={key} style={styles.divider} />);
      }
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <Text key={key} style={styles.h2}>
          {line.slice(3)}
        </Text>
      );
      return;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <Text key={key} style={styles.h1}>
          {line.slice(2)}
        </Text>
      );
      return;
    }

    if (line.startsWith('> ')) {
      blocks.push(
        <View key={key} style={styles.blockquote}>
          <Text style={styles.blockquoteText}>{renderInline(line.slice(2), key)}</Text>
        </View>
      );
      return;
    }

    blocks.push(
      <Text key={key} style={styles.paragraph}>
        {renderInline(line, key)}
      </Text>
    );
  });

  flushTable('table-end');
  flushList('list-end');

  return <Fragment>{blocks}</Fragment>;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
    marginBottom: 4,
  },
  h2: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.primaryDark,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: Brand.text,
  },
  bold: {
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginVertical: 4,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: Brand.border,
    paddingLeft: 12,
    paddingVertical: 2,
  },
  blockquoteText: {
    fontSize: 12,
    lineHeight: 18,
    color: Brand.textMuted,
    fontStyle: 'italic',
  },
  list: {
    gap: 4,
  },
  listRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listBullet: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Brand.text,
  },
  table: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  tableRowFirst: {
    borderTopWidth: 0,
    backgroundColor: Brand.background,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: Brand.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
