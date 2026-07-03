import DocItem from '@theme-original/DocItem';
import type DocItemType from '@theme/DocItem';
import type {WrapperProps} from '@docusaurus/types';
import ProgressMarker from '@site/src/components/ProgressMarker';

type Props = WrapperProps<typeof DocItemType>;

export default function DocItemWrapper(props: Props): JSX.Element {
  return (
    <>
      <DocItem {...props} />
      <ProgressMarker />
    </>
  );
}
