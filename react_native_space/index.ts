import 'expo-router/entry';
import { registerAndroidWidgets } from './widgets';

// Home-screen widgets run without the app open, so their handler is registered at bundle start.
registerAndroidWidgets();
