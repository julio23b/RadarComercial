import { trackDashboardEvent } from './analytics';

type ManagementActionParams = {
  action: 'create' | 'update' | 'delete' | 'publish' | string;
  entity: 'commerce' | 'category' | 'product' | string;
  commerce_id?: string | number;
  source_screen: string;
  user_id?: string;
};

export const trackManagementAction = (params: ManagementActionParams) =>
  trackDashboardEvent('management_action', {
    ...params,
  });

type CsvUploadParams = {
  file_name: string;
  rows_count: number;
  source_screen: string;
  user_id?: string;
};

export const trackCsvUpload = (params: CsvUploadParams) =>
  trackDashboardEvent('csv_upload', {
    ...params,
  });
