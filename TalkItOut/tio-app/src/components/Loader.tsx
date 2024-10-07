import {Stack, Spinner} from 'tamagui';

const Loader: React.FC = () => (
  <Stack alignItems="center" justifyContent="center" height="100%">
    <Spinner size="large" />
  </Stack>
);
export default Loader;
