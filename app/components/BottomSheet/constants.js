import { Dimensions } from 'react-native'


const { width } = Dimensions.get('window');
const height = width * 1;

export const DEVICE = {
  ...Dimensions.get('window')
}


export const ANIMATED = {
  HIDDEN: -(height - 50),
  FULL_OPEN: -50,
  VISIBLE: -(height - 150)
}


export const COLORS = {
  WHITE: '#FFF',
  BLACK: '#000',
  PRIMARY: '#5FB0FF',
  SECONDARY: '#C5B7AF'
}
