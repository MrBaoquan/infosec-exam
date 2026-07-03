import DocItemFooter from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import ProgressMarker from '@site/src/components/ProgressMarker';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  return (
    <>
      <DocItemFooter {...props} />
      <ProgressMarker />
    </>
  );
}
