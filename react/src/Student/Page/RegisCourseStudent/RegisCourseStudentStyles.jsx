import styled from 'styled-components';
import { Button, Card, Progress } from 'antd';

export const ScheduleContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 4rem 0;
`;

export const ScheduleWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const ScheduleCard = styled(Card)`
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: white;
`;

export const ScheduleTitle = styled.h2`
  margin-bottom: 1rem;
  color: #111827;
  text-align: center;
`;

export const ScheduleSubtitle = styled.span`
  font-size: 1.125rem;
  color: #4b5563;
  display: block;
  text-align: center;
`;

export const SectionTitle = styled.h4`
  margin-bottom: 1.5rem;
  color: #111827;
`;

export const DaySelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const DayButton = styled(Button)`
  &.ant-btn-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
`;

export const TimeSlotContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const TimeSlot = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  background: white;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }
`;

export const TimeSlotSelected = styled(TimeSlot)`
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
`;

export const TimeSlotIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 1rem;
`;

export const TimeSlotContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TimeSlotTitle = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

export const TimeSlotTime = styled.span`
  font-size: 0.875rem;
  opacity: 0.9;
`;

export const ClassCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const ClassHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

export const ClassInfo = styled.div`
  margin-left: 1rem;
  flex: 1;
`;

export const ClassSchedule = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const ClassTimeTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e1effe;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

export const ClassDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #4b5563;
  margin-top: 0.5rem;
`;

export const ClassDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProgressSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const ProgressTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const ConfirmationCard = styled(Card)`
  background-color: #e1effe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
`;

export const SubmitButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

export const StyledProgress = styled(Progress)`
  .ant-progress-text {
    color: #4b5563;
  }
`;

