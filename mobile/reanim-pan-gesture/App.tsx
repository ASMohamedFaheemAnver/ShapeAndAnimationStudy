import { GestureHandlerRootView } from "react-native-gesture-handler";
import Pan from "./components/Pan";
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pan />
    </GestureHandlerRootView>
  );
}
