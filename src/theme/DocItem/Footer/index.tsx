import DocItemFooter from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import ProgressMarker from '@site/src/components/ProgressMarker';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const {metadata} = useDoc();
  return (
    <>
      <DocItemFooter {...props} />
      <ProgressMarker docId={metadata.id} />
    </>
  );
}
