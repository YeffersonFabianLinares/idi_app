import { globalStyles } from '@/styles/style';
import { ChevronDown, Search, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList, Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import ErrorMessage from '../ErrorMessage';

// Definimos la interfaz para los items y las props
interface SelectItem {
  id: string | number;
  label: string;
}

interface Select2Props extends TextInputProps {
  endpoint: string;
  placeholder?: string;
  label: string
  name: string
  required?: boolean
  onSelect?: (item: SelectItem) => void;
  extraParams?: Record<string, any>;
}

const Select2Paginado: React.FC<Select2Props> = ({
  endpoint,
  label,
  name,
  placeholder = "Seleccione una opción",
  onSelect,
  required = true,
  extraParams = {},
  ...textInputProps
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const { control, setValue, formState: { errors } } = useFormContext();
  const error = errors[name];

  // Imitación de loadOptions de react-select-async-paginate
  const loadOptions = useCallback(async (currentSearch: string, currentPage: number) => {
    if (loading) return;
    setLoading(true);

    try {
      // Tu estructura de API: /endpoint?search=...&page=...
      const queryParams = new URLSearchParams({
        search: currentSearch,
        page: currentPage.toString(),
        ...extraParams // Esparcimos los parámetros extra (ej: ciudad: "Bogotá")
      }).toString();
      const response = await fetch(`${endpoint}?${queryParams}`);
      const json = await response.json();

      // Mapeamos los datos como lo hace AsyncPaginate
      const newOptions = json.data;
      const more = json.next_page !== null;

      setOptions(prev => (currentPage === 1 ? newOptions : [...prev, ...newOptions]));
      setHasMore(more);
      setPage(currentPage + 1);
      setLoading(true)
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, extraParams]);

  const handleSelectItem = (item: SelectItem) => {
    setSelectedValue(item);
    setVisible(false);
    setSearch('');
    setValue(name, item.id)
    if (onSelect) onSelect(item)
    setVisible(false)
  };

  useEffect(() => {
    if (!visible) {
      setSearch('')
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      loadOptions(search, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, visible, extraParams]);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <>
            <Text style={globalStyles.label}>
              {label} {required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            <TouchableOpacity style={[styles.trigger, error && { borderColor: 'red' }]} onPress={() => setVisible(true)}>
              <Text style={styles.triggerText}>{selectedValue ? selectedValue.label : placeholder}</Text>
              <ChevronDown color="#666" size={20} />
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <View style={styles.searchBar}>
                    <Search color="#94A3B8" size={18} />
                    <TextInput
                      placeholder="Escribe para buscar..."
                      style={[styles.input, loading && { opacity: 0.5 }]}
                      value={search}
                      onChangeText={setSearch}
                      autoFocus={true}
                      editable={!loading}
                      {...textInputProps}
                    />
                    {loading ? (
                      <ActivityIndicator size="small" color="#2D7A78" />
                    ) : (
                      search !== '' && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                          <X color="#94A3B8" size={18} />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={options}
                  keyExtractor={(item, index) => `item-${item.id}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem} onPress={() => {
                      handleSelectItem(item)
                      onChange(item.id)
                    }}>
                      <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  onEndReached={() => {
                    if (hasMore && !loading && options.length > 0) {
                      loadOptions(search, page);
                    }
                  }}
                  onEndReachedThreshold={0.1}
                  ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No se encontraron resultados</Text> : null}
                  ListFooterComponent={loading ? <ActivityIndicator color="#2D7A78" style={{ margin: 20 }} /> : null}
                  removeClippedSubviews={true}
                />
              </SafeAreaView>
            </Modal>
          </>
        )}
      />
      {error && (
        <ErrorMessage message={error.message?.toString()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Sombra ligera
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  triggerText: { color: '#334155', fontSize: 16, flex: 1 },
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 16, color: '#1E293B' },
  closeBtn: { marginLeft: 15 },
  closeBtnText: { color: '#2D7A78', fontWeight: '600', fontSize: 14 },
  listItem: {
    padding: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  itemText: { fontSize: 16, color: '#334155' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8' },
});

export default Select2Paginado;
