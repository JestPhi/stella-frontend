import Bar from "@/components/Bar";
import PageMore from "@/components/Buttons/PageMore";
import Panels from "@/components/Panels";
import style from "./style.module.css";

interface PageProps {
  pageNumber: number;
  panels: any;
  pageId: string;
}

const Page = (props: PageProps) => {
  const { pageNumber, panels, pageId } = props;
  return (
    <div className={style.page}>
      <Bar className={style.bar}>
        <PageMore pageId={pageId} />
      </Bar>
      <Panels items={panels} />
      <Bar className={style.pageNumber}>{pageNumber + 1}</Bar>
    </div>
  );
};

export default Page;
