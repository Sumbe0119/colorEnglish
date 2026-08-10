import { Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.notificationsService.list(userId);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  @Patch(':id/read')
  markRead(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.notificationsService.markRead(userId, id);
  }
}
