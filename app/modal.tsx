import { Button } from '@/components/elements/Button';
import { Input } from '@/components/elements/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useListas } from '@/contexts/ListasContext';
import { salvarProduto } from '@/repositories/produtoRepository';
import { eFilterStatus } from '@/types/FIlterStatus';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TIPOS = ['kg', 'litros', 'unidade', 'gramas', 'ml'];

export default function ModalScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { listaAtual } = useListas();

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('kg');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<eFilterStatus>(eFilterStatus.PENDING);
  const [showTipoPicker, setShowTipoPicker] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim() || !quantidade || !valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!listaAtual) {
      Alert.alert('Erro', 'Por favor, selecione uma lista primeiro');
      router.back();
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      await salvarProduto({
        nome: nome.trim(),
        quantidade: parseFloat(quantidade) || 0,
        status: status,
        tipo,
        valor: parseFloat(valor) || 0,
        listaId: listaAtual.id,
        userId: user.uid,
      });

      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} /> */}
        <View style={{ height: 400, backgroundColor: '#0A0E1A', borderTopWidth: 2, borderTopColor: "#2646B1" }}>
          {/* Header */}
          {/* <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Novo Item</Text>
            <View style={styles.closeButton} />
          </View> */}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row"
              }}
            >
              {/* Nome do Item */}
              <View style={styles.fieldContainer}>
                <Input
                  placeholder="Ex: Arroz, Feijão, Leite..."
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>

              {/* Quantidade */}
              <View style={styles.fieldContainer}>
                <Input
                  type="number"
                  placeholder="Ex: 2, 1.5, 10..."
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row"
              }}
            >
              {/* Valor Unitário */}
              <View style={styles.fieldContainer}>
                <Input
                  type="number"
                  placeholder="Ex: 8.99, 10.50..."
                  value={valor}
                  onChangeText={setValor}
                  keyboardType="decimal-pad"
                />
              </View>
              {/* Tipo */}
              <View style={styles.fieldContainer}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowTipoPicker(!showTipoPicker)}
                >
                  <Text style={styles.pickerText}>{tipo}</Text>
                  <Feather
                    name={showTipoPicker ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
                {showTipoPicker && (
                  <View style={styles.pickerOptions}>
                    {TIPOS.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.pickerOption,
                          tipo === t && styles.pickerOptionSelected,
                        ]}
                        onPress={() => {
                          setTipo(t);
                          setShowTipoPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            tipo === t && styles.pickerOptionTextSelected,
                          ]}
                        >
                          {t}
                        </Text>
                        {tipo === t && (
                          <Feather name="check" size={18} color="#2646B1" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Status */}
            <View style={styles.fieldContainer}>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    status === eFilterStatus.PENDING && styles.statusButtonActive,
                  ]}
                  onPress={() => setStatus(eFilterStatus.PENDING)}
                >
                  <Feather
                    name="circle"
                    size={18}
                    color={status === eFilterStatus.PENDING ? "#2646B1" : "#9CA3AF"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      status === eFilterStatus.PENDING && styles.statusTextActive,
                    ]}
                  >
                    Pendente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    status === eFilterStatus.COMPLETED && styles.statusButtonActive,
                  ]}
                  onPress={() => setStatus(eFilterStatus.COMPLETED)}
                >
                  <Feather
                    name="check-circle"
                    size={18}
                    color={status === eFilterStatus.COMPLETED ? "#2646B1" : "#9CA3AF"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      status === eFilterStatus.COMPLETED && styles.statusTextActive,
                    ]}
                  >
                    Completado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonsContainer}>
              <Button label="Adicionar Item" onPress={handleSubmit} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141b24',
    width: 80,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderColor: '#D1D5DB',
  },
  pickerText: {
    fontSize: 16,
    color: '#FFF',
  },
  pickerOptions: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  pickerOptionTextSelected: {
    color: '#2646B1',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1F2937',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statusButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2646B1',
  },
  statusText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statusTextActive: {
    color: '#2646B1',
    fontWeight: '600',
  },
  buttonsContainer: {
    marginTop: 8,
  },
  cancelButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
});
