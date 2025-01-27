interface Dorm {
  id: string;
  dorm_name: string;
  price: number;
  owner: string;
  pax: number;
  slots: number;
  location: string;
  image_url: string;
  offerings: string;
  rules: string;
  user_id: string;
}
// Define your navigation types
export type RootStackParamList = {
    Settings: undefined;        // SettingsScreen doesn't require any params
    EditAccount: undefined;     // EditAccount screen doesn't require any params either
    LoginSecurity: undefined;
    Properties: undefined;
    HomeDetails: { dorm: Dorm };
  };

export type MainStackParamList = {
    Tabs: undefined;
    HomeDetails: { dorm: Dorm }; // Define route params here
  };