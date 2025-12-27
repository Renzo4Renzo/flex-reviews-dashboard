const CHANNEL_MAP: Record<number, string> = {
  2018: 'Airbnb',
  2005: 'Booking.com',
  2007: 'Expedia',
};

export function getChannelName(channelId: number): string {
  return CHANNEL_MAP[channelId] || 'Unknown Channel';
}

export function getAllChannels(): { id: number; name: string }[] {
  return Object.entries(CHANNEL_MAP).map(([id, name]) => ({
    id: Number(id),
    name,
  }));
}
