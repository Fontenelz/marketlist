import { eFilterStatus } from "@/types/FIlterStatus";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps
} from "react-native";
import { Text } from "../Themed";
import { StatusIcon } from "./StatusIcon";

type FilterProps = TouchableOpacityProps & {
  status: eFilterStatus;
  isActive?: boolean;
  onPress?: () => void;
};

export default function Filter({ status, isActive, ...rest }: FilterProps) {
  const getFilterLabel = () => {
    switch (status) {
      case eFilterStatus.COMPLETED:
        return "Completados";
      case eFilterStatus.PENDING:
        return "Pendentes";
      case eFilterStatus.ALL:
        return "Todos";
      default:
        return "Todos";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        isActive && styles.activeContainer,
        rest.style,
      ]}
      {...rest}
    >
      <StatusIcon status={status} color={isActive ? "#2646B1" : "#CCCCCC"} />
      <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
        {getFilterLabel()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  containerWithoutIcon: {
    justifyContent: 'center',
  },
  activeContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#2646B1',
  },
  text: {
    fontSize: 12,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#2646B1',
  },
  inactiveText: {
    fontWeight: 'bold',
    color: '#6B7280',
  },
});
