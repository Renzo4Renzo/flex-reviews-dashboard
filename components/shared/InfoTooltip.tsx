import { Tooltip, ActionIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip
      label={text}
      multiline
      w={220}
      withArrow
      transitionProps={{ duration: 200 }}
      styles={{
        tooltip: {
          fontSize: '0.75rem',
          padding: '0.5rem',
        },
      }}
    >
      <ActionIcon variant="subtle" size="xs" color="gray">
        <IconInfoCircle size={14} />
      </ActionIcon>
    </Tooltip>
  );
}
