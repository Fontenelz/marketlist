import { eFilterStatus } from "@/types/FIlterStatus";
import { Feather } from "@expo/vector-icons";

type StatusIconProps = {
  status: eFilterStatus;
  color?: string;
  size?: number;
};

export function StatusIcon({ status, color, size = 18 }: StatusIconProps) {
  if (status === eFilterStatus.COMPLETED) {
    return <Feather name="check-circle" size={size} color={color ? color : "#2646B1"} />;
  }

  if (status === eFilterStatus.ALL) {
    return <Feather name="list" size={size} color={color ? color : "#2646B1"} />;
  }

  // Para PENDING ou outros status
  return <Feather name="circle" size={size} color={color ? color : "#CCC"} />;
}
