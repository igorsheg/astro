import { ChangeEvent, FC } from "react";
import { Category, Config } from "../../types";
import { localSrorageStore, uiStore } from "../../stores";
import styled from "styled-components";
import Flex from "../flex";
import SearchInput from "../search-input";
import Tabs from "../tabs";
import Actions from "./actions";
import Panel from "./panel";
import HeaderTitle from "./title";
import { useQuery } from "react-query";
import { fetcher } from "../../utils";
import { SAMPLE_CONFIG } from "../../consts/seed-data";

interface TopBarProps {
  catagories: Category[];
  onCategoryClick: (categoryId: string) => void;
  activeCategoryId: string;
  searchTerm: string;
  onSearchTermChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}
const TopBar: FC<TopBarProps> = ({
  catagories,
  onCategoryClick,
  activeCategoryId,
  searchTerm,
  onSearchTermChange,
}) => {
  const { activeThemeId } = localSrorageStore();
  const { inEditMode } = uiStore();

  const { data: config } = useQuery(
    ["configs", SAMPLE_CONFIG.id],
    ({ queryKey }) => fetcher<Config>(["configs", queryKey[1]])
  );

  return (
    <HeaderWrap>
      <Panel style={{ zIndex: 991, position: "relative" }} height="96px">
        {config && (
          <>
            <HeaderTitle config={config} activeThemeId={activeThemeId} />
            <Actions config={config} />
          </>
        )}
      </Panel>
      <Panel height="60px">
        <Tabs
          inEditMode={inEditMode}
          onItemClick={onCategoryClick}
          items={catagories}
          activeItem={activeCategoryId}
        />
        <Flex align="center" justify="flex-end">
          <SearchInput
            placeHolder="Search by service name..."
            height={36}
            growOnFocus
            value={searchTerm}
            onChange={onSearchTermChange}
          />
        </Flex>
      </Panel>
    </HeaderWrap>
  );
};

const HeaderWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 91;
  width: 100vw;
`;

export default TopBar;
