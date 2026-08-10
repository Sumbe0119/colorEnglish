import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { OnboardingDto } from './onboarding.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser('userId') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Post('onboarding')
  completeOnboarding(@CurrentUser('userId') userId: string, @Body() dto: OnboardingDto) {
    return this.profileService.completeOnboarding(userId, dto);
  }
}
