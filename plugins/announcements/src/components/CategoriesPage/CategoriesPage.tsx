import React, { useState } from 'react';
import { Page, Header, Content, Table, TableColumn, ErrorPanel } from '@backstage/core-components';
import { Button, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { NewCategoryDialog } from '../NewCategoryDialog';
import { useCategories } from '@clark-associates/backstage-plugin-announcements-react';
import { Category } from '@clark-associates/backstage-plugin-announcements-common';

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

const CategoriesTable = () => {
  const classes = useStyles();
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);

  const { categories, loading, error, retry } = useCategories();

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const onNewCategoryDialogClose = () => {
    setNewCategoryDialogOpen(false);
    retry();
  };

  const columns: TableColumn<Category>[] = [
    {
      title: 'Slug',
      field: 'slug',
      highlight: true,
    },
    {
      title: 'Title',
      field: 'title',
    },
  ];

  return (
    <>
      <Table
        options={{ paging: false }}
        data={categories || []}
        columns={columns}
        isLoading={loading}
        title="Categories"
        actions={[
          {
            icon: () => <AddIcon />,
            tooltip: 'Add',
            isFreeAction: true,
            onClick: _event => setNewCategoryDialogOpen(true),
          },
        ]}
        emptyContent={
          <div className={classes.empty}>
            <p>No category was created yet.</p>
            <p>
              <Button color="primary" variant="outlined" onClick={() => setNewCategoryDialogOpen(true)}>
                Add category
              </Button>
            </p>
          </div>
        }
      />
      <NewCategoryDialog open={newCategoryDialogOpen} onClose={onNewCategoryDialogClose} />
    </>
  );
};

type CategoriesPageProps = {
  themeId: string;
};

export const CategoriesPage = (props: CategoriesPageProps) => {
  return (
    <Page themeId={props.themeId}>
      <Header title="Categories" subtitle="Manage announcement categories" />

      <Content>
        <CategoriesTable />
      </Content>
    </Page>
  );
};
