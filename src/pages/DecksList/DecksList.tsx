import { useDebounce } from '@/common/hooks/useDebounce'
import { Page } from '@/common/ui/Page'
import { Pagination } from '@/common/ui/Pagination'
import { Preloader } from '@/common/ui/Preloader'
import { getSortObj } from '@/common/utils'
import { useMeQuery } from '@/features/auth'
import { DecksFilters, DecksHeader, DecksTable, useGetDecksQuery } from '@/features/deck'

import s from './DecksList.module.scss'

import { useDecksFilters } from './useDecksFilters'

export const DecksList = () => {
  const {
    currentPage,
    handleChangeCardsCounts,
    handleChangeItemsPerPage,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleChangeTabValue,
    handleClearFilters,
    itemsPerPage,
    maxCardsCount,
    minCardsCount,
    name,
    orderBy,
    show,
  } = useDecksFilters()

  const debounceName = useDebounce(name)
  const debounceMin = useDebounce(minCardsCount)
  const debounceMax = useDebounce(maxCardsCount)

  const { data: userData } = useMeQuery()

  const { data, isFetching, isLoading } = useGetDecksQuery({
    authorId: show === 'my' ? userData?.id : undefined,
    currentPage,
    itemsPerPage,
    maxCardsCount: debounceMax,
    minCardsCount: debounceMin,
    name: debounceName,
    orderBy,
  })

  if (isLoading) {
    return <Preloader size={100} />
  }

  const startMaxCardsCount = Number((data && data.maxCardsCount) || maxCardsCount)

  return (
    <Page mt="33px">
      <DecksHeader />
      <DecksFilters
        cardsCounts={[minCardsCount, maxCardsCount ?? startMaxCardsCount]}
        className={s.filters}
        disabled={isFetching}
        handleChangeCardsCounts={handleChangeCardsCounts}
        handleChangeSearch={handleChangeSearch}
        handleChangeTabValue={handleChangeTabValue}
        handleClearFilters={handleClearFilters}
        max={data?.maxCardsCount}
        searchValue={name}
        tabValue={show}
      />
      <div className={s.tableContainer}>
        <DecksTable
          authId={userData?.id ?? ''}
          className={s.table}
          handleChangeSort={handleChangeSort}
          isLoading={isFetching}
          items={data?.items}
          itemsPerPage={itemsPerPage}
          sort={getSortObj(orderBy)}
        />
      </div>
      <Pagination
        className={s.pagination}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        onValueChange={handleChangeItemsPerPage}
        options={[
          { title: '5', value: '5' },
          { title: '10', value: '10' },
          { title: '20', value: '20' },
          { title: '30', value: '30' },
        ]}
        pageSize={itemsPerPage}
        totalCount={data?.pagination.totalItems ?? 0}
        value={String(itemsPerPage)}
      />
    </Page>
  )
}
