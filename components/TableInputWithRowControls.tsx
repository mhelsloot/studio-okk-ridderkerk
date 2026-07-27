import {AddIcon, InsertAboveIcon, InsertBelowIcon, RemoveIcon} from '@sanity/icons'
import {Box, Button, Card, Dialog, Flex, Inline, Text, TextInput, Tooltip} from '@sanity/ui'
import {uuid} from '@sanity/uuid'
import {type FormEvent, useState} from 'react'
import {type ObjectInputProps, set, unset} from 'sanity'

const ROW_TYPE = 'tableRow'

type TableRow = {
  _type: string
  _key: string
  cells: string[]
}

type TableValue = {
  _type: 'table'
  rows: TableRow[]
}

type TableProps = ObjectInputProps<TableValue>

const deepClone: <T>(data: T) => T =
  globalThis.structuredClone ?? ((data) => JSON.parse(JSON.stringify(data)))

// Custom table input based on @sanity/table's TableComponent, extended with
// per-row buttons to insert a new row directly above or below it.
export function TableInputWithRowControls(props: TableProps) {
  const {value, onChange} = props
  const [dialog, setDialog] = useState<{type: string; callback: () => void} | null>(null)

  const updateValue = (v?: Omit<TableValue, '_type'>) => onChange(set(v))
  const resetValue = () => onChange(unset())

  const createTable = () => {
    const newValue: Omit<TableValue, '_type'> = {
      rows: [
        {_type: ROW_TYPE, _key: uuid(), cells: ['', '']},
        {_type: ROW_TYPE, _key: uuid(), cells: ['', '']},
      ],
    }
    return updateValue({...value, ...newValue})
  }

  const confirmRemoveTable = () => setDialog({type: 'table', callback: removeTable})
  const removeTable = () => {
    resetValue()
    setDialog(null)
  }

  const addRowAt = (index: number) => {
    if (!value) return
    const newValue = deepClone(value)
    const columnCount = value.rows[0]?.cells.length ?? 0

    newValue.rows.splice(index, 0, {
      _type: ROW_TYPE,
      _key: uuid(),
      cells: Array(columnCount).fill(''),
    })

    return updateValue(newValue)
  }

  const removeRow = (index: number) => {
    if (!value) return
    const newValue = deepClone(value)
    newValue.rows.splice(index, 1)
    updateValue(newValue)
    setDialog(null)
  }

  const confirmRemoveRow = (index: number) => {
    if (!value) return
    if (value.rows.length <= 1) return confirmRemoveTable()
    return setDialog({type: 'row', callback: () => removeRow(index)})
  }

  const addColumn = () => {
    if (!value) return
    const newValue = deepClone(value)
    newValue.rows.forEach((row) => row.cells.push(''))
    return updateValue(newValue)
  }

  const removeColumn = (index: number) => {
    if (!value) return
    const newValue = deepClone(value)
    newValue.rows.forEach((row) => row.cells.splice(index, 1))
    updateValue(newValue)
    setDialog(null)
  }

  const confirmRemoveColumn = (index: number) => {
    if (!value) return
    if (value.rows[0].cells.length <= 1) return confirmRemoveTable()
    return setDialog({type: 'column', callback: () => removeColumn(index)})
  }

  const updateCell = (e: FormEvent<HTMLInputElement>, rowIndex: number, cellIndex: number) => {
    if (!value) return
    const newValue = deepClone(value)
    newValue.rows[rowIndex].cells[cellIndex] = (e.target as HTMLInputElement).value
    return updateValue(newValue)
  }

  return (
    <div>
      {dialog && (
        <Dialog
          header={`${dialog.type} verwijderen`}
          id="dialog-remove"
          onClose={() => setDialog(null)}
          zOffset={1000}
        >
          <Card padding={4}>
            <Text>Weet je zeker dat je deze {dialog.type} wilt verwijderen?</Text>
            <Box marginTop={4}>
              <Inline space={1} style={{textAlign: 'right'}}>
                <Button text="Annuleren" mode="ghost" onClick={() => setDialog(null)} />
                <Button text="Verwijderen" tone="critical" onClick={() => dialog.callback()} />
              </Inline>
            </Box>
          </Card>
        </Dialog>
      )}

      {value?.rows?.length ? (
        <>
        <Flex justify="flex-end" gap={1} marginBottom={2}>
          <Button
            icon={AddIcon}
            fontSize={1}
            padding={2}
            mode="ghost"
            text="Kolom"
            onClick={addColumn}
          />
          <Button
            icon={RemoveIcon}
            fontSize={1}
            padding={2}
            mode="ghost"
            tone="critical"
            text="Tabel"
            onClick={confirmRemoveTable}
          />
        </Flex>
        <table style={{width: '100%'}}>
          <tbody>
            {value.rows.map((row, rowIndex) => (
              <tr key={row._key}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={`cell-${row._key}-${cellIndex}`}>
                    <TextInput
                      fontSize={1}
                      padding={3}
                      value={cell}
                      onChange={(e) => updateCell(e, rowIndex, cellIndex)}
                    />
                  </td>
                ))}
                <td>
                  <Flex marginLeft={1} gap={1}>
                    <Tooltip content={<Box padding={2}>Rij boven invoegen</Box>}>
                      <Button
                        icon={InsertAboveIcon}
                        padding={2}
                        onClick={() => addRowAt(rowIndex)}
                        mode="bleed"
                      />
                    </Tooltip>
                    <Tooltip content={<Box padding={2}>Rij onder invoegen</Box>}>
                      <Button
                        icon={InsertBelowIcon}
                        padding={2}
                        onClick={() => addRowAt(rowIndex + 1)}
                        mode="bleed"
                      />
                    </Tooltip>
                    <Tooltip content={<Box padding={2}>Rij verwijderen</Box>}>
                      <Button
                        icon={RemoveIcon}
                        padding={2}
                        onClick={() => confirmRemoveRow(rowIndex)}
                        mode="bleed"
                        tone="critical"
                      />
                    </Tooltip>
                  </Flex>
                </td>
              </tr>
            ))}
            <tr>
              {value.rows[0]?.cells.map((_, i) => (
                <td key={i}>
                  <Box marginTop={1} style={{textAlign: 'center'}}>
                    <Button
                      icon={RemoveIcon}
                      padding={2}
                      onClick={() => confirmRemoveColumn(i)}
                      mode="bleed"
                    />
                  </Box>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        </>
      ) : (
        <Inline space={1}>
          <Button
            fontSize={1}
            padding={3}
            icon={AddIcon}
            text="Tabel aanmaken"
            tone="primary"
            mode="ghost"
            onClick={createTable}
          />
        </Inline>
      )}
    </div>
  )
}
